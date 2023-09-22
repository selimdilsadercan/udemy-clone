import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex justify-center items-center h-full">
      <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
    </main>
  );
}
