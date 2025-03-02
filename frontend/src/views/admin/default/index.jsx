import React from "react";
import HourlyVisits from "views/admin/default/components/HourlyVisits";
import DailyVisits from "views/admin/default/components/DailyVisits";
import DailyComparison from "views/admin/default/components/DailyComparison";
import SummaryCard from "views/admin/default/components/SummaryCard";
import FootfallForecast from "views/admin/default/components/FootfallForecast";
import { IoMdPeople } from "react-icons/io";
import { MdAccessTime, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { FaChartLine } from "react-icons/fa";
import { useStore } from "components/StoreContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "fetcher";
import Widget from "components/widget/Widget";

const fetchWidgetData = async (storeId) => {
  const response = await makeRequest("GET", `/api/footfall/dashboard-widgets-data/${storeId}`);
  if (response.status === '200') {
    const data = response.data
    return data
  }
  throw new Error("Failed to fetch widget data");
};

const Dashboard = () => {
  const { storeId } = useStore();

  const { data: widgetData, isLoading, error } = useQuery({
    queryKey: ["dashboardWidgetData", storeId],
    queryFn: () => fetchWidgetData(storeId),
    enabled: !!storeId, // Only fetch when storeId is available
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    // refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  return (
    <div>

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget icon={<IoMdPeople className="h-7 w-7" />} title={"Total Entries Today"} subtitle={widgetData?.totalFootfallToday} />
        <Widget icon={<MdAccessTime className="h-7 w-7" />} title={"Busiest Hour Today"} subtitle={widgetData?.busiestHourToday} />
        <Widget icon={<MdAccessTime className="h-7 w-7" />} title={"Least Busy Hour Today"} subtitle={widgetData?.quietestHourToday} />
        <Widget icon={<MdTrendingUp className="h-7 w-7" />} title={"Busiest Day This Week"} subtitle={widgetData?.busiestDayThisWeek} />
        <Widget icon={<MdTrendingDown className="h-7 w-7" />} title={"Least Busy Day This Week"} subtitle={widgetData?.quietestDayThisWeek} />
        <Widget icon={<FaChartLine className="h-7 w-7" />} title={"Total Entries This Week"} subtitle={widgetData?.totalFootfallThisWeek} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <>
        <DailyVisits key={storeId} data={widgetData?.dailyFootfall}/>
        </>
        <HourlyVisits key={storeId} data={widgetData?.hourlyFootfall} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div>
          < DailyComparison currentWeekData={widgetData?.dailyFootfall} lastWeekData={widgetData?.dailyFootfallPreviousWeek} percentageChangeInVisits={widgetData?.weeklyFootfallChange} totalVisitsLastWeek={widgetData?.totalFootfallPreviousWeek} totalVisitsThisWeek={widgetData?.totalFootfallThisWeek} />
        </div>

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <SummaryCard data={widgetData?.summary} />
          < FootfallForecast key={storeId}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
