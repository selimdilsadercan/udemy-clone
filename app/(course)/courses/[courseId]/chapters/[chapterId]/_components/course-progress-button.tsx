"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useConfetti } from "@/hooks/use-confetti";

////

interface Props {
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isCompleted: boolean;
}

//prettier-ignore
const CourseProgressButton = ({ courseId, chapterId, nextChapterId, isCompleted }: Props) => {
  //hooks
  const router = useRouter();
  const confetti = useConfetti();

  //variables
  const Icon = isCompleted ? XCircle : CheckCircle

  //complete chapter
  const { mutate: completeChapter, isLoading: isEnrolling } = useMutation({
    mutationFn: async () => {
      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, { isCompleted: !isCompleted }); 
      if (!isCompleted && !nextChapterId) confetti.onOpen();
      if (!isCompleted && nextChapterId) router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
    },
    onError: (err) => {
      console.log("[CHAPTER_COMPLETE]", err);
      toast.error("Failed to mark as complete");
    },
    onSuccess: () => {
      toast.success("Progess updated");
      router.refresh()
    },
  });

  return (
    <Button
      className="w-full md:w-auto"
      onClick={() => completeChapter()}
      variant={isCompleted ? "outline" : "success"}
      type="button"
      disabled={isEnrolling}
    >
      {isCompleted ? "Mark as Not Completed" : "Mark as Completed"}
      <Icon className="h-4 w-4 ml-2"/>
    </Button>
  );
};

export default CourseProgressButton;
