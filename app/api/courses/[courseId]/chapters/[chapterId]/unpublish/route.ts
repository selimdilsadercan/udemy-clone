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

    //authorization control
    const courseOwner = await db.course.findFirst({
      where: { id: courseId, userId },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    //prisma
    const unpublishedChapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { isPublished: false },
    });

    //course control
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: { courseId, isPublished: true },
    });
    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
    }

    ////

    return NextResponse.json(unpublishedChapter);

    ////
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse(`${error}`, { status: 500 });
  }
}
