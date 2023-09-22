import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type Param = { params: { courseId: string; chapterId: string } };

export async function PATCH(req: Request, params: Param) {
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

    //authorization control
    const courseOwner = await db.course.findFirst({
      where: { id: courseId, userId },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    //video control
    const muxData = await db.muxData.findFirst({
      where: { chapterId },
    });

    //prettier-ignore
    if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) { 
      return new NextResponse("Missing required fields", { status: 400 });
    }

    //prisma
    const publishedChapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedChapter);

    ////
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse(`${error}`, { status: 500 });
  }
}
