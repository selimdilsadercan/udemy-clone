import IconBadge from "@/components/icon-badge";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import DescriptionForm from "./_components/descripiton-form";
import TitleForm from "./_components/title-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChapterForm from "./_components/chapter-form";
import Banner from "@/components/banner";
import CourseActions from "./_components/course-actions";

interface Props {
  params: { courseId: string };
}

const Page = async ({ params }: Props) => {
  //authantication control
  const { userId } = auth();
  if (!userId) return redirect("/");

  ////

  //course prisma
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId: userId,
    },
    include: {
      attachments: { orderBy: { createdAt: "desc" } },
      chapters: { orderBy: { position: "asc" } },
    },
  });

  if (!course) return redirect("/");

  ////

  //categories prisma
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const categoryOptions = categories.map((cate) => ({
    label: cate.name,
    value: cate.id,
  }));

  ////

  //required fields
  const requiredFields = [course.title, course.description, course.imageUrl, course.price, course.categoryId, course.chapters.some((chapter) => chapter.isPublished)]; //prettier-ignore

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isCompleted = requiredFields.every(Boolean);

  ////

  return (
    <>
      {!course.isPublished && (
        <Banner
          variant="warning"
          label="This course is unpublished. It will not be visible to the students"
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>

            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>

          <CourseActions disabled={!isCompleted} course={course} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} />
            <DescriptionForm initialData={course} />
            <ImageForm initialData={course} />
            <CategoryForm initialData={course} options={categoryOptions} />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChapterForm initialData={course} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={course} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
