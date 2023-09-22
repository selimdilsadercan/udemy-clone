"use client";

import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/modals/confirm-modal";
import { useConfetti } from "@/hooks/use-confetti";

////

interface Props {
  disabled: boolean;
  course: Course;
}

function CourseActions({ course, disabled }: Props) {
  //params
  const courseId = course.id;
  const isPublished = course.isPublished;

  //hooks
  const router = useRouter();
  const confetti = useConfetti();

  //delete course
  const { mutate: deleteCourse, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/courses/${courseId}`);
    },
    onError: (err) => {
      console.log("[COURSE_UPDATE_PAGE]", err);
      toast.error("Failed to delete course");
    },
    onSuccess: () => {
      toast.success("Course deleted");
      router.refresh();
      router.push(`/teacher/courses`);
    },
  });

  //toggle publish course
  const { mutate: togglePublishCourse, isLoading: isPublishing } = useMutation({
    mutationFn: async () => {
      const route = isPublished ? "unpublish" : "publish";
      await axios.patch(`/api/courses/${courseId}/${route}`);
    },
    onError: (err) => {
      console.log("[COURSE_TOGGLEPUBLISH]", err);
      toast.error("Failed to publish course");
    },
    onSuccess: () => {
      isPublished ? toast.success("Course unpublished") : toast.success("Course published"); //prettier-ignore
      !isPublished && confetti.onOpen();
      router.refresh();
    },
  });

  ////

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={() => togglePublishCourse()}
        disabled={disabled || isPublishing || isDeleting}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <ConfirmModal onConfirm={deleteCourse}>
        <Button size="sm" disabled={isDeleting || isPublishing}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}

export default CourseActions;
