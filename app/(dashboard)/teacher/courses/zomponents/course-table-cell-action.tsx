"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"; //prettier-ignore
import { Course } from "@prisma/client";
import { Pencil, MoreHorizontalIcon } from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface Props {
  courseId: string;
}

function CourseCellAction({ courseId }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-8 h-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <Link href={`/teacher/courses/${courseId}`}>
          <DropdownMenuItem>
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CourseCellAction;
