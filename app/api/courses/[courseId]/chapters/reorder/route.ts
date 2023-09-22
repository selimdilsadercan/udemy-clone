import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type Param = { params: { courseId: string } };

export async function PUT(req: Request, params: Param) {
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
    const { list } = body;
    if (!body) {
      return new NextResponse("Missing values", { status: 400 });
    }

    //authorization control
    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    //prisma
    for (let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse("success", { status: 200 });

    ////
  } catch (error) {
    console.log("[ROERDER_CHAPTERS]", error);
    return new NextResponse(`${error}`, { status: 500 });
  }
}
