import CoursesList from "@/components/courses-list";
import { getDashboard } from "@/helpers/get-dashboard";
import { auth } from "@clerk/nextjs";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import InfoCard from "./_components/info-card";

async function Page() {
  //authantication control
  const { userId } = auth();
  if (!userId) return redirect("/");

  //get dashboard
  const { completedCourses, inProgressCourses } = await getDashboard({ userId }); //prettier-ignore
  const allCourses = [...completedCourses, ...inProgressCourses];

  ////

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={inProgressCourses.length}
        />
        <InfoCard
          icon={CheckCircle}
          variant="success"
          label="Completed"
          numberOfItems={completedCourses.length}
        />
      </div>

      <CoursesList courses={allCourses} />
    </div>
  );
}

export default Page;
