"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  disabled: boolean;
  chapter: Chapter;
}

function ChapterActions({ chapter, disabled }: Props) {
  //params
  const courseId = chapter.courseId;
  const chapterId = chapter.id;
  const isPublished = chapter.isPublished;

  //hooks
  const router = useRouter();

  //delete chapter
  const { mutate: deleteChapter, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
    },
    onError: (err) => {
      console.log("[CHAPTER_UPDATE_PAGE]", err);
      toast.error("Failed to delete chapter");
    },
    onSuccess: () => {
      toast.success("Chapter deleted");
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    },
  });

  //publish chapter
  const { mutate: togglePublishChapter, isLoading: isPublishing } = useMutation(
    {
      mutationFn: async () => {
        const route = isPublished ? "unpublish" : "publish";
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/${route}`); //prettier-ignore
      },
      onError: (err) => {
        console.log("[CHAPTER_PUBLISH]", err);
        toast.error("Failed to publish chapter");
      },
      onSuccess: () => {
        isPublished ? toast.success("Chapter unpublished") : toast.success("Chapter published"); //prettier-ignore
        router.refresh();
      },
    }
  );

  ////

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={() => togglePublishChapter()}
        disabled={disabled || isPublishing || isDeleting}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <ConfirmModal onConfirm={deleteChapter}>
        <Button size="sm" disabled={isDeleting || isPublishing}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}

export default ChapterActions;
