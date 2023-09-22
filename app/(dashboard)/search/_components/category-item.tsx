"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconType } from "react-icons";
import qs from "query-string";

////

interface Props {
  label: string;
  icon: IconType;
  value: string;
}

const CategoryItem = ({ label, value, icon: Icon }: Props) => {
  //hooks
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  //params
  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  //variables
  const isSelected = currentCategoryId === value;

  //methods
  function updateQueryParams() {
    const url = qs.stringifyUrl(
      { url: pathname, query: { categoryId: isSelected ? null : value, title: currentTitle } }, //prettier-ignore
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }

  ////

  return (
    <button
      onClick={updateQueryParams}
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-700"
      )}
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </button>
  );
};

export default CategoryItem;
