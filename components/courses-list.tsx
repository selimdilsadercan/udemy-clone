import { Course } from "@prisma/client";
import CourseCard from "@/components/course-card";
import { ExtendedCourse } from "@/types/course-types";

interface Props {
  courses: ExtendedCourse[];
}

const CoursesList = ({ courses }: Props) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
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

        {courses.length === 0 && (
          <div className="text-center text-sm text-muted-foreground mt-10">
            No courses found. Try changing your search parameters.
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
