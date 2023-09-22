"use client";

import { Category } from "@prisma/client";
import { FcEngineering, FcFilmReel, FcMultipleDevices, FcMusic, FcOldTimeCamera, FcSalesPerformance, FcSportsMode } from "react-icons/fc"; //prettier-ignore
import { IconType } from "react-icons";
import CategoryItem from "./category-item";

////

const iconMap: Record<Category["name"], IconType> = {
  "Music": FcMusic,
  "Photography": FcOldTimeCamera,
  "Fitness": FcSportsMode,
  "Accounting": FcSalesPerformance,
  "Computer Science": FcMultipleDevices,
  "Filming": FcFilmReel,
  "Engineering": FcEngineering,
};

////

interface Props {
  categories: Category[];
}

const Categories = ({ categories }: Props) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          label={category.name}
          icon={iconMap[category.name]}
          value={category.id}
        />
      ))}
    </div>
  );
};

export default Categories;
