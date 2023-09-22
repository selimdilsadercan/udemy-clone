import db from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    //authantication control
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthanticated", { status: 401 });
    }

    //authorization control
    const isAuthorized = isTeacher(userId);
    if (!isAuthorized) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    //body control
    const body = await req.json();
    const { title } = body;
    if (!title) {
      return new NextResponse("Missing title", { status: 400 });
    }

    //prisma
    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    });

    return NextResponse.json(course);

    ////
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse(`${error}`, { status: 500 });
  }
}
