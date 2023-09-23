"use client";

import { Button } from "@/components/ui/button";
import { format } from "@/lib/format";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

////

interface Props {
  courseId: string;
  price: number;
}

function CourseEnrollButton({ courseId, price }: Props) {
  //enroll course
  const { mutate: createCourse, isLoading: isEnrolling } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      return response.data;
    },
    onError: (err) => {
      console.log("[COURSE_CHECKOUT]", err);
      toast.error("Failed to enroll");
    },
    onSuccess: (data) => {
      window.location.assign(data.url);
    },
  });

  return (
    <Button
      className="w-full md:w-auto"
      size="sm"
      onClick={() => createCourse()}
      disabled={isEnrolling}
    >
      Enroll for {format(price)}
    </Button>
  );
}

export default CourseEnrollButton;
