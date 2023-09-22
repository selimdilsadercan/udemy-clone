"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import FileUpload from "@/components/file-upload";
import { z } from "zod";
import MuxPlayer from "@mux/mux-player-react";

////

const formSchema = z.object({
  videoUrl: z.string().min(1, { message: "Video is required" }),
});
type FormValues = z.infer<typeof formSchema>;

////

interface Props {
  initialData: Chapter & { muxData?: MuxData | null };
}

const ChapterVideoForm = ({ initialData }: Props) => {
  //params
  const courseId = initialData.courseId;
  const chapterId = initialData.id;

  ////

  //hooks
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const toggleEditing = () => setIsEditing(!isEditing);

  ////

  //mutations
  const { mutate: updateChapter } = useMutation({
    mutationFn: async (values: FormValues) => {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values); //prettier-ignore
    },
    onError: (err) => {
      console.log("[CHAPTER_UPDATE_PAGE]", err);
      toast.error("Failed to update chapter");
    },
    onSuccess: () => {
      toast.success("Chapter updated");
      toggleEditing();
      router.refresh();
    },
  });

  ////

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 m-2" /> Add Video
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 m-2" /> Change
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer
              playbackId={initialData?.muxData?.playbackId || ""}
            ></MuxPlayer>
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) updateChapter({ videoUrl: url });
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}

      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
