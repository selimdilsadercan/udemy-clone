"use client";

import { useConfetti } from "@/hooks/use-confetti";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  title: string;
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

//prettier-ignore
function VideoPlayer({ chapterId, completeOnEnd, courseId, isLocked, nextChapterId, playbackId, title }: Props) {
  //hooks
  const [isReady, setIsReady] = useState<boolean>(false);
  const router = useRouter(); 
  const confetti = useConfetti();

  //complete chapter
  const { mutate: completeChapter } = useMutation({
    mutationFn: async () => {
      if(completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, { isCompleted: true });
        if(!nextChapterId) confetti.onOpen();
        if(nextChapterId) router.push(`/courses/${courseId}/chapters/${nextChapterId}`);  
        router.refresh()
      } 
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
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="text-secondary w-8 h-8 animate-spin" />
        </div>
      )}

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="w-8 h-8" />
          <p className="text-sm">
            This chapter is locked
          </p>
        </div>
      )}

      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={() => completeChapter()}
          // autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  )
}

export default VideoPlayer;
