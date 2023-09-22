"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";
import { z } from "zod";

////

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

type FormValues = z.infer<typeof formSchema>;

////

interface Props {
  initialData: Course;
}

function ImageForm({ initialData }: Props) {
  //params
  const courseId = initialData.id;

  ////

  //hooks
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const toggleEditing = () => setIsEditing(!isEditing);

  ////

  //mutations
  const { mutate: updateCourse } = useMutation({
    mutationFn: async (values: FormValues) => {
      await axios.patch(`/api/courses/${courseId}`, values);
    },
    onError: (err) => {
      console.log("[COURSE_UPDATE_PAGE]", err);
      toast.error("Failed to update course");
    },
    onSuccess: () => {
      toast.success("Course updated");
      toggleEditing();
      router.refresh();
    },
  });

  ////

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 m-2" /> Add image
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 m-2" /> Change
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) updateCourse({ imageUrl: url });
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">
            16/9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageForm;
