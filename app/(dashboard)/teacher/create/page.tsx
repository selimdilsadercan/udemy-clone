"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

////

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

type FormValues = z.infer<typeof formSchema>;
type Event = React.FormEvent<HTMLFormElement>;

////

const Page = () => {
  //form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  //hooks
  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  //mutations
  async function onSubmit(e: Event, values: FormValues) {
    e.preventDefault();
    createCourse(values);
  }

  const { mutate: createCourse } = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await axios.post("/api/courses", values);
      return response.data;
    },
    onError: (err) => {
      console.log("[COURSE_CREATE_PAGE]", err);
      toast.error("Failed to create course");
    },
    onSuccess: (data) => {
      router.push(`/teacher/courses/${data.id}`);
      toast.success("Course created");
    },
  });

  ////

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry you can
          change later.
        </p>

        <Form {...form}>
          <form
            onSubmit={(e) => onSubmit(e, form.getValues())}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>

                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced Web Development'"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    What will you teachin this course?
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button variant="ghost" type="button">
                  {/* type button diyerek oto submit yapmasını engelledik */}
                  Cancel
                </Button>
              </Link>

              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
