import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SelectedCourse } from "@/types/course-types";
import CourseSidebarItem from "./course-sidebar-item";
import db from "@/lib/db";
import CourseProgress from "./course-progress";

////

interface Props {
  course: SelectedCourse;
  progressCount: number;
}

const CourseSidebar = async ({ course, progressCount }: Props) => {
  //authentication control
  const { userId } = auth();
  if (!userId) redirect("/");

  //fetch purchase
  const purchase = await db.purchase.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>

      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgresses?.[0]?.isCompleted}
            courseId={chapter.courseId}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
