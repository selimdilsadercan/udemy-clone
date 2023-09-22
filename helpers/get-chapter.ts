import db from "@/lib/db";
import { getProgress } from "./get-progress";
import { ExtendedCourse } from "@/types/course-types";
import { Attachment, Chapter } from "@prisma/client";

interface Props {
  userId: string;
  courseId: string;
  chapterId: string;
}

//prettier-ignore
export const getChapter = async ({ userId, courseId, chapterId }: Props) => {
  try {
    //fetch purchase
    const purchase = await db.purchase.findUnique({
      where: { userId_courseId: {userId, courseId} }
    })

    //fetch course
    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
      select: { price: true }
    })

    //fetch chapter
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, isPublished: true },
    })

    //chapter and course control
    if(!chapter || !course ) throw new Error("Chapter or course not found") 

    //variables
    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;
    
    //fetch attachments
    if(purchase) {
      attachments = await db.attachment.findMany({
        where: { courseId }
      })
    }

    //fetch mux data and next chapter
    if(chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: { chapterId }
      })

      nextChapter = await db.chapter.findFirst({
        where: { 
          courseId, isPublished: true, 
          position: { gt: chapter?.position } 
        }, 
        orderBy: {
          position: "asc"
        }
      })
    }

    //fetch user progress
    const userProgress = await db.userProgress.findUnique({
      where: { userId_chapterId: { userId, chapterId } }
    })

    ////

    const result = {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    }

    return result;
  } 
  
  catch (error) {
    console.log("[GET_CHAPTER]", error);

    const result = {
      chapter: null,
      course: null,
      muxData: null,
      attachments: null,
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };

    return result;
  }
};
