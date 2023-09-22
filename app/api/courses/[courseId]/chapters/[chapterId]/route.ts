import db from "@/lib/db";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

type Param = { params: { courseId: string; chapterId: string } };

export async function PATCH(req: Request, params: Param) {
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
    const chapterId = params.params.chapterId;
    if (!chapterId) {
      return new NextResponse("Chapter id is required", { status: 400 });
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

    //body control
    const body = await req.json();
    const { isPublished, ...values } = body;
    if (!body) {
      return new NextResponse("Missing values", { status: 400 });
    }

    ////

    //prisma
    const chapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { ...values },
    });

    ////

    //mux
    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId },
      });

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({ where: { id: existingMuxData.id } });
      }

      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0].id,
        },
      });
    }

    return NextResponse.json(chapter);

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
    const chapterId = params.params.chapterId;
    if (!chapterId) {
      return new NextResponse("Chapter id is required", { status: 400 });
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

    //chapter control
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    });
    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    ////

    //video control
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId },
      });

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({ where: { id: existingMuxData.id } });
      }
    }

    ////

    //prisma
    const deletedChapter = await db.chapter.delete({
      where: { id: chapterId, courseId },
    });

    ////

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

    return NextResponse.json(chapter);

    ////
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse(`${error}`, { status: 500 });
  }
}
