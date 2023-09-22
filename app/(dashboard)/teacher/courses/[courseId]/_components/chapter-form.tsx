"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import ChaptersList from "./chapters-list";

////

const formSchema = z.object({
  title: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;
type Event = React.FormEvent<HTMLFormElement>;

////

interface Props {
  initialData: Course & { chapters: Chapter[] };
}

function ChapterForm({ initialData }: Props) {
  //params
  const courseId = initialData.id;

  //hooks
  const router = useRouter();
  const [isCreating, setIsCreating] = useState<Boolean>(false);
  const toggleCreating = () => setIsCreating(!isCreating);

  ////

  //form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });
  const { isSubmitting, isValid } = form.formState;

  ////

  //update course
  function onSubmit(e: Event, values: FormValues) {
    e.preventDefault();
    updateCourse(values);
  }

  const { mutate: updateCourse, isLoading } = useMutation({
    mutationFn: async (values: FormValues) => {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
    },
    onError: (err) => {
      console.log("[COURSE_ID_CHAPTER_CREATE]", err);
      toast.error("Failed to create chapter");
    },
    onSuccess: () => {
      form.resetField("title");
      toast.success("Chapter created");
      toggleCreating();
      router.refresh();
    },
  });

  ////

  //reorder chapters
  const { mutate: reorderChapters, isLoading: isUpdating } = useMutation({
    mutationFn: async (list: { id: string; position: number }[]) => {
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, { list });
    },
    onError: (err) => {
      console.log("[COURSE_ID_CHAPTER_REORDER]", err);
      toast.error("Failed to reorder chapters");
    },
    onSuccess: () => {
      toast.success("Chapters reordered");
      router.refresh();
    },
  });

  ////

  //on edit
  function onEdit(chapterId: string) {
    router.push(`/teacher/courses/${courseId}/chapters/${chapterId}`);
  }

  ////

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}

      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating && <>Cancel</>}
          {!isCreating && (
            <>
              <PlusCircle className="h-4 w-4 m-2" /> Add Chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={(e) => onSubmit(e, form.getValues())}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting || isLoading}
                      placeholder="e.g. 'Introdcution to course'"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={!isValid || isSubmitting || isLoading}
              type="submit"
            >
              Create
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.chapters.length && "text-slate-500 italic"
          )}
        >
          {!initialData.chapters.length && "No chapters"}
          <ChaptersList
            onEdit={onEdit}
            onReorder={reorderChapters}
            items={initialData.chapters || []}
          />
        </div>
      )}

      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the chapters.
        </p>
      )}
    </div>
  );
}

export default ChapterForm;
