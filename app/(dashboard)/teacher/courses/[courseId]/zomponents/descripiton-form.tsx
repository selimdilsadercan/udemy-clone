"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";

////

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

type FormValues = z.infer<typeof formSchema>;
type Event = React.FormEvent<HTMLFormElement>;

////

interface Props {
  initialData: Course;
}

function DescriptionForm({ initialData }: Props) {
  //params
  const courseId = initialData.id;

  //hooks
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const toggleEditing = () => setIsEditing(!isEditing);

  ////

  //form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: initialData.description || "" },
  });
  const { isSubmitting, isValid } = form.formState;
  ////

  //mutations
  function onSubmit(e: Event, values: FormValues) {
    e.preventDefault();
    updateCourse(values);
  }

  const { mutate: updateCourse, isLoading } = useMutation({
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
        Course Descripiton
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <Pencil className="h-4 w-4 m-2" /> Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-500 italic"
          )}
        >
          {initialData.description || "No description"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={(e) => onSubmit(e, form.getValues())}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. 'This course is about...'"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting || isLoading}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

export default DescriptionForm;
