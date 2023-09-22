import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import db from "@/lib/db";

////

interface Props {
  params: { courseId: string };
}

async function Page({ params }: Props) {
  //authentication control
  const { userId } = auth();
  if (!userId) redirect("/");

  //params
  const courseId = params.courseId;

  // fetch course
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: { where: { isPublished: true }, orderBy: { position: "asc" } },
    },
  });
  if (!course) redirect("/");

  /////

  return redirect(`/courses/${courseId}/chapters/${course.chapters[0].id}`);
}

export default Page;
