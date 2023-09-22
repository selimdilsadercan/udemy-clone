import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs";
import Stripe from "stripe";
import db from "@/lib/db";

type Param = { params: { courseId: string } };

export async function POST(reg: Request, params: Param) {
  try {
    //authentication control
    const user = await currentUser();
    const userId = user?.id;
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!user || !userId || !email) {
      return new NextResponse("Unauthanticated", { status: 401 });
    }

    ////

    //param control
    const courseId = params.params.courseId;
    if (!courseId) {
      return new NextResponse("Course id is required", { status: 400 });
    }

    ////

    //purchase control
    const purchase = await db.purchase.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    ////

    //course control
    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
    });
    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }
    const title = course.title;
    const description = course.description!;

    ////

    //stripe line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: { name: title, description },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    ////

    //fetch stripteCustomer
    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: { userId },
      select: { stripeCustomerId: true },
    });
    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: email,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: { userId, stripeCustomerId: customer.id },
      });
    }

    ////

    //create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?cancel=1`,
      metadata: { courseId, userId },
    });

    return NextResponse.json({ url: session.url });

    ////
  } catch (error) {
    console.log("[COURSE_CHECKOUT]", error);
    return new NextResponse(`${error}`, { status: 500 });
  }
}
