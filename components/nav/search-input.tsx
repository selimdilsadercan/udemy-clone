"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchInput = () => {
  //hooks
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  //params
  const currentCategoryId = searchParams.get("categoryId");

  //effects
  useEffect(() => {
    const url = qs.stringifyUrl(
      { url: pathname, query: { categoryId: currentCategoryId, title: debouncedValue} }, //prettier-ignore
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  ////

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-300" />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for courses"
      />
    </div>
  );
};

export default SearchInput;
