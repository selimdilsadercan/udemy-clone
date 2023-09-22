import { redirect } from "next/navigation";
import { getCourses } from "@/helpers/get-courses";
import { auth } from "@clerk/nextjs";
import Categories from "./_components/categories";
import SearchInput from "@/components/nav/search-input";
import CoursesList from "@/components/courses-list";
import db from "@/lib/db";

////

interface Props {
  searchParams: { tile: string; categoryId: string };
}

async function Page({ searchParams }: Props) {
  //authentication control
  const { userId } = auth();
  if (!userId) return redirect("/");

  //fetch categories
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  //get courses
  const courses = await getCourses({ userId, ...searchParams });

  ////

  return (
    <>
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <SearchInput />
      </div>

      <div className="p-6 space-y-4">
        <Categories categories={categories} />
        <CoursesList courses={courses} />
      </div>
    </>
  );
}

export default Page;
