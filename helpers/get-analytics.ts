import db from "@/lib/db";
import { AnalyticsPurchase } from "@/types/course-types";

////

//prettier-ignore
export const getAnalytics = async ({ userId }: { userId: string }) => {
  try {
    //get purchases
    const purchases = await db.purchase.findMany({
      where: { course: { userId } },
      include: { course: true },
    });
    const totalSales = purchases.length;

    //group by course
    const groupedEarnings = groupByCourse({ purchases });

    //get revenue
    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({ name: courseTitle, total: total })
    );
    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);

    //result
    const result = {
      data,
      totalRevenue,
      totalSales,
    };

    return result;
  } 
  
  catch (error) {
    console.log("[GET_ANALYTICS]", error);

    const result = {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };

    return result;
  }
};

////

const groupByCourse = ({ purchases }: { purchases: AnalyticsPurchase[] }) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) grouped[courseTitle] = 0;
    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};
