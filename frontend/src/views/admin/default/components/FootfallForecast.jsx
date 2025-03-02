import { TbDeviceAnalytics } from "react-icons/tb";
import { useStore } from "components/StoreContext";
import { useQuery } from "@tanstack/react-query";
import Card from "components/card";
import { makeRequest } from "fetcher";
import BarChart from "components/charts/BarChart";

const fetchForecastData = async (storeId) => {
    const response = await makeRequest("GET", `/api/footfall/forecast/${storeId}`);
    if (response.status === '200') {
      const data = response.data
      return data
    }
    throw new Error("Failed to fetch forecast data");
  };

const FootfallForecast = () => {
    const { storeId } = useStore();
  
    const { data, isLoading, error } = useQuery({
      queryKey: ["footfallForecastData", storeId],
      queryFn: () => fetchForecastData(storeId),
      enabled: !!storeId, // Only fetch when storeId is available
      staleTime: 1000 * 60 * 60, // Cache for 60 minutes
    });
    const barChartForecastPredictions = [
        {
          name: "Forecast Traffic",
          data: data?.dailyPredictions,
        },
    ];

    return (
        <Card extra="pb-7 p-[20px]">
            <div className="relative flex flex-row justify-between">
                <div className="flex items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lightPrimary dark:bg-navy-700 dark:bg-white/5">
                        <TbDeviceAnalytics className="h-6 w-6 text-brand-500 dark:text-white" />
                    </div>
                    <h4 className="ml-4 text-xl font-bold text-navy-700 dark:text-white">
                        AI forecast predictions
                    </h4>
                </div>
            </div>

            <div className="h-[300px] w-full pt-10 pb-0">
                {!isLoading && <BarChart
                chartData={barChartForecastPredictions}
                chartOptions={barChartOptionsForecastPredictions}
                />}
            </div>
        </Card>
    );

};

export default FootfallForecast;

const barChartOptionsForecastPredictions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
        backgroundColor: "#000000"
      },
      onDatasetHover: {
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
      },
      theme: "dark",
    },
    xaxis: {
        categories: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      show: false,
      labels: {
        show: true,
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      color: "black",
      labels: {
        show: true,
        style: {
          colors: "#CBD5E0",
          fontSize: "14px",
        },
      },
    },
    grid: {
      show: false,
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        colorStops: [
          [
            {
              offset: 0,
              color: "#4318FF",
              opacity: 1,
            },
            {
              offset: 100,
              color: "rgba(67, 24, 255, 1)",
              opacity: 0.28,
            },
          ],
        ],
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "30px",
      },
    },
  };