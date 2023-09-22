import db from "@/lib/db";
import { Dashboard, DashboardCourse } from "@/types/course-types";
import { getProgress } from "./get-progress";

interface Props {
  userId: string;
}

//prettier-ignore
export const getDashboard = async ({ userId }: Props): Promise<Dashboard> => {
  try {
    //fetch purchase
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId
      },
      select: {
        course: { include: { category: true, chapters: { where: { isPublished: true } } } },
      }
    });

    //get courses
    const courses = purchasedCourses.map((purchase) => purchase.course as DashboardCourse);

    //get progresses
    for (let course of courses) {
      const progress = await getProgress({ userId, courseId: course.id });
      course.progress = progress;
    }

    //get completed courses
    const completedCourses = courses.filter((course) => course.progress === 100);
    const inProgressCourses = courses.filter((course) => course.progress !== 100);

    //result
    const result: Dashboard = {
      completedCourses,
      inProgressCourses,
    }

    return result;
  } 
  
  catch (error) {
    console.log("[GET_DASHBOARD]", error);

    const result: Dashboard = {
      completedCourses: [],
      inProgressCourses: [],
    }

    return result;
  }
};
