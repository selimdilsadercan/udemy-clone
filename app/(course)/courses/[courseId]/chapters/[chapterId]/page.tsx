import Banner from "@/components/banner";
import { getChapter } from "@/helpers/get-chapter";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/video-player";
import CourseEnrollButton from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import Preview from "@/components/preview";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/course-progress-button";

interface Props {
  params: { courseId: string; chapterId: string };
}

async function Page({ params }: Props) {
  //authentication control
  const { userId } = auth();
  if (!userId) redirect("/");

  //params
  const courseId = params.courseId;
  const chapterId = params.chapterId;

  //get values
  const { chapter, course, muxData, nextChapter, userProgress, purchase, attachments } = await getChapter({ chapterId, courseId, userId }); //prettier-ignore
  if (!chapter || !course) return redirect("/");

  //variables
  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner label="You already completed this chapter" variant="success" />
      )}
      {isLocked && (
        <Banner label="You need to purchase this course to watch this chapter" />
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>

        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>

          {purchase && (
            <CourseProgressButton
              chapterId={chapterId}
              courseId={courseId}
              nextChapterId={nextChapter?.id}
              isCompleted={!!userProgress?.isCompleted}
            />
          )}
          {!purchase && (
            <CourseEnrollButton courseId={courseId} price={course.price!} />
          )}
        </div>

        <Separator />

        <div className="">
          <Preview value={chapter.description!} />
        </div>

        {!!attachments.length && (
          <>
            <Separator />
            <div className="p-4">
              {attachments.map((attachment) => (
                <a
                  href={attachment.url}
                  target="_blank"
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                >
                  <File />
                  <p className="line-clamp-1">{attachment.name}</p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
