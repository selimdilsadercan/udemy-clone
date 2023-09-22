import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type Param = { params: { courseId: string } };

export async function POST(req: Request, params: Param) {
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

    //body control
    const body = await req.json();
    const { title } = body;
    if (!title) {
      return new NextResponse("Missing title", { status: 400 });
    }

    //authorization control
    const courseOwner = await db.course.findFirst({
      where: { id: courseId, userId },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    //position control
    const lastChapter = await db.chapter.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
    });
    const position = lastChapter ? lastChapter.position + 1 : 1;

    //prisma
    const chapter = await db.chapter.create({
      data: { title, courseId, position },
    });

    return NextResponse.json(chapter);

    ////
  } catch (error) {
    console.log("[COURSE_ID_CHAPTER]", error);
    return new NextResponse(`${error}`, { status: 500 });
  }
}
