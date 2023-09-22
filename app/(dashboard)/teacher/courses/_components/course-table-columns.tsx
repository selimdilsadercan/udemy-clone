"use client";

import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import { ColumnDef, Row, Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import CourseCellAction from "./course-table-cell-action";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "@/lib/format";

// import { CellAction } from "./cource-cell-action";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <SortedHeader column={column} text="Title" />,
    cell: ({ row }) => <TitleCell row={row} />,
  },

  {
    accessorKey: "price",
    header: ({ column }) => <SortedHeader column={column} text="Price" />,
    cell: ({ row }) => <DollarCell row={row} />,
  },

  {
    accessorKey: "isPublished",
    header: ({ column }) => <SortedHeader column={column} text="Published" />,
    cell: ({ row }) => <PublishCell row={row} />,
  },

  {
    id: "actions",
    cell: ({ row }) => <CourseCellAction courseId={row.original.id} />,
  },
];

////

//prettier-ignore
const SortedHeader = ({ column, text }: { column: Column<Course>; text: string }) => { 
  return (
    //prettier-ignore
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      {text}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

////

const PublishCell = ({ row }: { row: Row<Course> }) => {
  const isPublished = row.getValue("isPublished") || false;

  return (
    <div className="px-4">
      <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
        {isPublished ? "Published" : "Draft"}
      </Badge>
    </div>
  );
};

////

const DollarCell = ({ row }: { row: Row<Course> }) => {
  const price = parseFloat(row.getValue("price") || "0");
  const formatted = format(price);

  return <div className="px-4">{formatted}</div>;
};

////

const TitleCell = ({ row }: { row: Row<Course> }) => {
  return <div className="px-4">{row.getValue("title")}</div>;
};
