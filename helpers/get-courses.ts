import db from "@/lib/db";
import { getProgress } from "./get-progress";
import { ExtendedCourse } from "@/types/course-types";

type GetCoursesParams = {
  userId: string;
  title?: string;
  categoryId?: string;
};

//prettier-ignore
export const getCourses = async ({ userId, title, categoryId }: GetCoursesParams): Promise<ExtendedCourse[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true, title: { contains: title }, categoryId,
      },
      include: {
        category: true,
        chapters: { where: { isPublished: true }, select: { id: true } },
        purchases: { where: { userId } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const extendedCourses: ExtendedCourse[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return { ...course, progress: null }
          }

          const progressPercentage = await getProgress({userId, courseId: course.id});

          return { ...course,  progress: progressPercentage };
        })
      );

    return extendedCourses;
  } 
  
  catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
