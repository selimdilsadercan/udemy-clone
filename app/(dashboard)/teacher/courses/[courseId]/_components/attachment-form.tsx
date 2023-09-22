"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";
import { z } from "zod";

const formSchema = z.object({
  url: z.string().min(1),
});

////

interface Props {
  initialData: Course & { attachments: Attachment[] };
}

const AttachmentForm = ({ initialData }: Props) => {
  //params
  const courseId = initialData.id;

  ////

  //hooks
  const router = useRouter();

  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const toggleEditing = () => setIsEditing(!isEditing);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  ////

  //create attachment
  const { mutate: createAttachment } = useMutation({
    mutationFn: async (values: any) => {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
    },
    onError: (err) => {
      console.log("[COURSE_ID_CREATE_ATTACHMENT]", err);
      toast.error("Failed to upload attachment");
    },
    onSuccess: () => {
      toast.success("File uploaded");
      toggleEditing();
      router.refresh();
    },
  });

  ////

  //delete attachment
  const { mutate: deleteAttachment } = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
    },
    onError: (err) => {
      setDeletingId(null);
      console.log("[COURSE_ID_DELETE_ATTACHMENT]", err);
      toast.error("Failed to delete attachment");
    },
    onSuccess: () => {
      setDeletingId(null);
      toast.success("File deleted");
      router.refresh();
    },
  });

  ////

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing && <>Cancel</>}

          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 m-2" /> Add file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length == 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />

                  <p className="text-xs line-clamp-1">{attachment.name}</p>

                  {deletingId === attachment.id && (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      className="ml-auto hover:opacity-75 transition"
                      onClick={() => deleteAttachment(attachment.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachments"
            onChange={(url) => createAttachment({ url: url })}
          />

          <div className="text-xs text-muted-foreground mt-4">
            Add anything that will help students learn more about your course.
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
