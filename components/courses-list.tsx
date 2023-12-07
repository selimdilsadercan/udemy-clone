import { Course } from "@prisma/client";
import CourseCard from "@/components/course-card";
import { ExtendedCourse } from "@/types/course-types";

interface Props {
  courses: ExtendedCourse[];
}

const CoursesList = ({ courses }: Props) => {
  return (
    <div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {courses.map((course: ExtendedCourse) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            imageUrl={course.imageUrl!}
            chaptersLength={course.chapters.length}
            price={course.price!}
            progress={course.progress}
            category={course?.category?.name!}
          />
        ))}
      </div>
      {courses.length === 0 && (
        <div className="w-full mt-10 text-sm text-center text-muted-foreground">
          No courses found. Try changing your search parameters.
        </div>
      )}
    </div>
  );
};

export default CoursesList;
