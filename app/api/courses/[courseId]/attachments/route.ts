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
    const { url } = body;
    if (!url) {
      return new NextResponse("Missing url", { status: 400 });
    }

    //authorization control
    const courseOwner = await db.course.findFirst({
      where: { id: courseId, userId },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    //prisma
    const attachment = await db.attachment.create({
      data: {
        url,
        courseId,
        name: url.split("/").pop(),
      },
    });

    return NextResponse.json(attachment);

    ////
  } catch (error) {
    console.log("[COURSE_ID_ATTACHMENTS]", error);
    return new NextResponse(`${error}`, { status: 500 });
  }
}
