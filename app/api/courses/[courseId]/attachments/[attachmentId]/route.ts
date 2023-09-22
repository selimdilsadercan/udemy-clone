import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type Param = { params: { courseId: string; attachmentId: string } };

export async function DELETE(req: Request, params: Param) {
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
    const attachmentId = params.params.attachmentId;
    if (!attachmentId) {
      return new NextResponse("Attachment id is required", { status: 400 });
    }

    //authorization control
    const courseOwner = await db.course.findFirst({
      where: { id: courseId, userId },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    //prisma
    const attachment = await db.attachment.delete({
      where: {
        courseId: courseId,
        id: attachmentId,
      },
    });

    return NextResponse.json(attachment);

    ////
  } catch (error) {
    console.log("[COURSE_ID_ATTACHMENT_ID]", error);
    return new NextResponse(`${error}`, { status: 500 });
  }
}
