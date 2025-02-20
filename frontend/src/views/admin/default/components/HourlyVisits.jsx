import Card from "components/card";
import BarChart from "components/charts/BarChart";
import { MdBarChart } from "react-icons/md";

const storeOpeningHour = 9;
const storeClosingHour = 24;
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const filteredHours = hours.slice(storeOpeningHour, storeClosingHour); 

const HourlyVisits = ({ data }) => {
    if (!data || data.length !== 24) {
        console.error("Invalid or missing data for HourlyVisits component.");
        return null;
    }
    
    const filteredData = data.slice(storeOpeningHour, storeClosingHour);
    const chartData = [
        {
        name: "Footfall",
        data: filteredData,
        color: "#4318FF",
        },
    ];

    return (
        <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
            <div className="mb-auto flex items-center justify-between px-6">
                <h2 className="text-lg font-bold text-navy-700 dark:text-white">
                Hourly Footfall Summary
                </h2>
                <button className="rounded-lg bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20">
                <MdBarChart className="h-6 w-6" />
                </button>
            </div>

            <div className="md:mt-16 lg:mt-0">
                <div className="h-[250px] w-full xl:h-[350px]">
                <BarChart chartData={chartData} chartOptions={chartOptions} />
                </div>
            </div>
        </Card>
    );
};

export default HourlyVisits;

const chartOptions = {
    chart: {
        toolbar: { show: false },
    },
    xaxis: {
        categories: filteredHours,
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
        colors: ["#5E37FF"],
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            columnWidth: "14px",
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
        x: {
            formatter: (value, { dataPointIndex }) => {
              const startHour = filteredHours[dataPointIndex]; // Get the hour
              const temp = startHour.split(':')
              const finalStartHour = Number(temp[0])
              const endHour = finalStartHour + 1 === 24 ? 0 : finalStartHour + 1; // Wrap around midnight
              return `${startHour} - ${endHour}:00`;
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
        active: {
            allowMultipleDataPointsSelection: false,
            filter: {
                type: 'none', // Prevents unwanted color changes when a bar is clicked
            },
        },
    },
};