import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getProgress } from "@/helpers/get-progress";
import CourseNavbar from "./_components/course-navbar";
import CourseSidebar from "./_components/course-sidebar";
import db from "@/lib/db";

////

interface Props {
  children: React.ReactNode;
  params: { courseId: string };
}

const Layout = async ({ children, params }: Props) => {
  //authentication control
  const { userId } = auth();
  if (!userId) return redirect("/");

  //fetch course
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: { isPublished: true },
        include: { userProgresses: { where: { userId } } },
        orderBy: { position: "asc" },
      },
    },
  });
  if (!course) return redirect("/");

  //get progress
  const progressCount = await getProgress({ userId, courseId: course.id });

  ////

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>

      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>

      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default Layout;
