import { getAnalytics } from "@/helpers/get-analytics";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import DataCard from "./_components/data-card";
import Chart from "./_components/chart";

const Page = async () => {
  //authentication control
  const { userId } = auth();
  if (!userId) redirect("/");

  //get analytics
  const { data, totalRevenue, totalSales } = await getAnalytics({ userId });

  ////

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard value={totalRevenue} label="Total Revenue" isFormatted />
        <DataCard value={totalSales} label="Total Sales" />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default Page;
