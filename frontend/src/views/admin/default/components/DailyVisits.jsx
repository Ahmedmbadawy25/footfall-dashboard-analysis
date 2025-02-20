import Card from "components/card";
import BarChart from "components/charts/BarChart";
import { MdBarChart } from "react-icons/md";

const DailyVisits = ({data}) => {
    if (!data || data.length !== 7) {
        console.error("Invalid or missing data for DailyVisits component.");
        return null;
    }
    const filteredData = data
    const chartData = [
        {
        name: "Footfall",
        data: filteredData,
        color: "#6AD2Fa",
        },
    ];
    return (
        <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
        <div className="mb-auto flex items-center justify-between px-6">
            <h2 className="text-lg font-bold text-navy-700 dark:text-white">
            Daily Visits
            </h2>
            <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
            <MdBarChart className="h-6 w-6" />
            </button>
        </div>

        <div className="md:mt-16 lg:mt-0">
            <div className="h-[250px] w-full xl:h-[350px]">
            <BarChart
                chartData={chartData}
                chartOptions={chartOptions}
            />
            </div>
        </div>
        </Card>
    );
};

export default DailyVisits;

const chartOptions = {
    chart: {
        toolbar: { show: false },
    },
    xaxis: {
        categories: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        labels: {
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
        show:true,
        labels: {
            show: true,
            style: {
            colors: "#A3AED0",
            fontSize: "12px",
            fontWeight: "500",
            },
        },
    },
    fill: {
        type: "solid",
        colors: ["#6AD2Fa"],
    },
    plotOptions: {
        bar: {
            borderRadius: 8,
            columnWidth: "24px",
        },
    },
    grid: {
        show: false
    },
    tooltip: {
        style: {
          fontSize: "12px",
          fontFamily: undefined,
          backgroundColor: "#000000"
        },
        theme: 'dark',
        onDatasetHover: {
          style: {
            fontSize: "12px",
            fontFamily: undefined,
          },
        },
        y: {
            formatter: (value, { dataPointIndex }) => {
              return `${value} people visited`;
            },
        },
      },
      dataLabels: {
        enabled: false, // Disables numbers on top of bars
      },
      states: {
        hover: {
            filter: {
                type: 'darken', // Keeps the bar visible on hover
                value: 0.5, // Adjust opacity (0 = fully transparent, 1 = no change)
            },
        },
        active: {
            allowMultipleDataPointsSelection: false,
            filter: {
                type: 'none', // Prevents unwanted color changes when a bar is clicked
            },
        },
    },
};