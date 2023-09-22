import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import db from "@/lib/db";

export async function POST(req: Request) {
  //get body
  const body = await req.text();

  ////

  //get signature
  const signature = headers().get("Stripe-Signature") as string;

  ////

  //variables
  let event: Stripe.Event;

  ////

  //webhook control
  //prettier-ignore
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } 
  catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  ////

  //get session
  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  ////

  //prettier-ignore
  if (event.type === "checkout.session.completed") {
    //metadata control
    if (!userId || !courseId) {
      return new NextResponse("Webhook Error: Missing Metadata", { status: 400 }); 
    }

    //prisma
    await db.purchase.create({
      data: { courseId, userId },
    });
  } 
  else {
    return new NextResponse("Webhook Error: Unhandled event type", { status: 200 }); 
  }

  return new NextResponse(null, { status: 200 });
}
