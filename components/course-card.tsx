"use client";

import Image from "next/image";
import Link from "next/link";
import IconBadge from "./icon-badge";
import { BookOpen } from "lucide-react";
import { format } from "@/lib/format";
import CourseProgress from "@/app/(course)/courses/[courseId]/zomponents/course-progress";

interface Props {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
}

//prettier-ignore
const CourseCard = ({ id, title, imageUrl, chaptersLength, price, progress, category }: Props) => { 
  return <Link href={`/courses/${id}`} className="">
    <div className="h-full p-3 overflow-hidden transition border rounded-lg group hover:shadow-sm">
      <div className="relative w-full overflow-hidden rounded-md aspect-video">
        <Image 
          fill
          className="object-cover"
          alt={title}
          src={imageUrl} 
        />
      </div>

      <div className="flex flex-col pt-2">
        <div className="text-lg font-medium transition md:text-base group-hover:text-sky-700 line-clamp-2">
          {title}
        </div>

        <p className="text-xs text-muted-foreground">
          {category}
        </p>

        <div className="flex items-center my-3 text-sm gap-x-2 md:text-xs">
          <div className="flex items-center gap-x-1 text-slate-500">
            <IconBadge size="sm" icon={BookOpen}/> 
            <span>
              {chaptersLength} {chaptersLength === 1 ? "chapter" : "chapters"}
            </span>
          </div>
        </div>

        
        {progress !== null ? (
          <CourseProgress 
            size="sm" 
            value={progress} 
            variant={progress === 100 ? "success" : "default"}
          />
        ) : (
          <p className="font-medium text-md md:text-sm text-slate-700">{format(price)}</p>
        )}
      </div>
    </div>
  </Link>
}

export default CourseCard;
