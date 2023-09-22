import IconBadge from "@/components/icon-badge";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterTitleForm from "./_components/chapter-title-form";
import ChapterDescriptionForm from "./_components/chapter-description-form";
import ChapterAccesssForm from "./_components/chapter-access-form";
import ChapterVideoForm from "./_components/chapter-video-form";
import Banner from "@/components/banner";
import ChapterActions from "./_components/chapter-actions";

interface Props {
  params: { courseId: string; chapterId: string };
}

const Page = async ({ params }: Props) => {
  //params
  const courseId = params.courseId;
  const chapterId = params.chapterId;

  //authantication control
  const { userId } = auth();
  if (!userId) return redirect("/");

  ////

  //chapter prisma
  const chapter = await db.chapter.findUnique({
    where: { id: chapterId, courseId },
    include: { muxData: true },
  });
  if (!chapter) return redirect("/");

  ////

  //required fields
  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isCompleted = requiredFields.every(Boolean);

  ////

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course"
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter setup</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>

              <ChapterActions disabled={!isCompleted} chapter={chapter} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your chapter</h2>
            </div>
            <ChapterTitleForm initialData={chapter} />
            <ChapterDescriptionForm initialData={chapter} />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Video} />
                <h2 className="text-xl">Add a video</h2>
              </div>
              <ChapterVideoForm initialData={chapter} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access settings</h2>
              </div>
              <ChapterAccesssForm initialData={chapter} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
