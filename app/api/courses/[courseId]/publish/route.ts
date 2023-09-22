import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type Param = { params: { courseId: string } };

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

    //course control
    const course = await db.course.findUnique({
      where: { id: courseId, userId },
      include: { chapters: { include: { muxData: true } } },
    });
    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    //authorization control
    const courseOwner = await db.course.findFirst({
      where: { id: courseId, userId },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    //chapter control
    const publishedChapters = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    //prettier-ignore
    if (!course.title || !course.description || !course.imageUrl || !course.price || !course.categoryId || !publishedChapters ){ 
      return new NextResponse("Missing required fields", { status: 400 });
    }

    //prisma
    const publishedCourse = await db.course.update({
      where: { id: courseId, userId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedCourse);

    ////
  } catch (error) {
    console.log("[COURSE_PUBLISH]", error);
    return new NextResponse(`${error}`, { status: 500 });
  }
}
