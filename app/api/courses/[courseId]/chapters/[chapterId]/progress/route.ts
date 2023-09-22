import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type Param = { params: { courseId: string; chapterId: string } };

export async function PUT(req: Request, params: Param) {
  try {
    //authentication control
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthanticated", { status: 401 });
    }

    //param control
    const courseId = params.params.courseId;
    if (!courseId) {
      return new NextResponse("Course id is required", { status: 400 });
    }
    const chapterId = params.params.chapterId;
    if (!chapterId) {
      return new NextResponse("Chapter id is required", { status: 400 });
    }

    //chapter control
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    });
    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    //body control
    const body = await req.json();
    const { isCompleted } = body;
    if (!body) {
      return new NextResponse("Missing values", { status: 400 });
    }

    //upsert progress
    const userProgress = await db.userProgress.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      update: { isCompleted },
      create: { userId, chapterId, isCompleted },
    });

    return NextResponse.json(userProgress);

    ////
  } catch (error) {
    console.log("[CHAPTER_PROGRESS]", error);
    return new NextResponse(`${error}`, { status: 500 });
  }
}
