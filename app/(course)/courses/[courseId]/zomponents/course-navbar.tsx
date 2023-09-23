import NavbarRoutes from "@/components/nav/navbar-routes";
import { SelectedCourse } from "@/types/course-types";
import { Chapter, Course, UserProgress } from "@prisma/client";
import CourseMobileSidebar from "./course-mobile-sidebar";

interface Props {
  course: SelectedCourse;
  progressCount: number;
}

function CourseNavbar({ course, progressCount }: Props) {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
}

export default CourseNavbar;
