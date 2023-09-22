import db from "@/lib/db";

type GetProgressParams = {
  userId: string;
  courseId: string;
};

//prettier-ignore
export const getProgress = async ({ userId, courseId }: GetProgressParams): Promise<number> => { 
  try {
    const publishedChapters = await db.chapter.findMany({
      where: { courseId, isPublished: true},
      select: { id: true },
    });

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    const validCompletedChapters = await db.userProgress.count({
      where: { userId, chapterId: { in: publishedChapterIds }, isCompleted: true },
    });

    const progressPercentage = ( validCompletedChapters / publishedChapterIds.length ) * 100;

    return progressPercentage;
  } 
  catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
}
