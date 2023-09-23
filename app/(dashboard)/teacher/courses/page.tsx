import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { columns } from "./zomponents/course-table-columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import db from "@/lib/db";

async function Page() {
  //authentication control
  const { userId } = auth();
  if (!userId) redirect("/");

  //fetch courses
  const courses = await db.course.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
}

export default Page;
