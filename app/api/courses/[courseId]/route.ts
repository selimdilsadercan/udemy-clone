import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

type Param = { params: { courseId: string } };

export async function PATCH(req: Request, params: Param) {
  try {
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
    if (!body) {
      return new NextResponse("Missing values", { status: 400 });
    }

    //prisma
    const course = await db.course.update({
      where: {
        id: courseId,
        userId: userId,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(course);

    ////
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse(`${error}`, { status: 500 });
  }
}

////

export async function DELETE(req: Request, params: Param) {
  try {
    //authentication control
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthanticated", { status: 401 });
    }

    ////

    //param control
    const courseId = params.params.courseId;
    if (!courseId) {
      return new NextResponse("Course id is required", { status: 400 });
    }

    ////

    //authorization control
    const courseOwner = await db.course.findFirst({
      where: { id: courseId, userId },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    ////

    //course control
    const course = await db.course.findUnique({
      where: { id: courseId, userId },
      include: { chapters: { include: { muxData: true } } },
    });
    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    ////

    //delete videos
    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    ////

    //prisma
    const deletedCourse = await db.course.delete({
      where: { id: courseId, userId },
    });

    return NextResponse.json(deletedCourse);

    ////
  } catch (error) {
    console.log("[COURSE_DELETE]", error);
    return new NextResponse(`${error}`, { status: 500 });
  }
}
