import React from "react";
import { MdArrowDropUp, MdArrowDropDown, MdBarChart } from "react-icons/md";
import Card from "components/card";
import LineChart from "components/charts/LineChart";

const DailyComparison = ({ currentWeekData, lastWeekData, percentageChangeInVisits, totalVisitsLastWeek, totalVisitsThisWeek }) => {

    const chartData = [
        {
        name: "Current Week",
        data: currentWeekData,
        color: "#6AD2FF",
        },
        {
        name: "Last Week",
        data: lastWeekData,
        color: "#4318FF",
        },
    ];

    if (!currentWeekData || currentWeekData.length !== 7) {
        console.error("Invalid or missing data for DailyComparison component.");
        return null;
    }

    let changeColor = "text-gray-500";
    let ChangeIcon = null;

    if (percentageChangeInVisits > 0) {
        changeColor = "text-green-500";
        ChangeIcon = MdArrowDropUp;
    } else if (percentageChangeInVisits < 0) {
        changeColor = "text-red-500";
        ChangeIcon = MdArrowDropDown;
    }

    return (
        <Card extra="!p-[20px] text-center h-full">
        <div className="flex justify-between">
            <h2 className="text-lg font-bold text-navy-700 dark:text-white">
                Weekly Comparison
            </h2>
            <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
            <MdBarChart className="h-6 w-6" />
            </button>
        </div>

        <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
            <div className="flex flex-col">
            <p className="mt-2 text-sm text-gray-600">This Week:</p>
            <p className="text-sm font-bold"> {totalVisitsThisWeek} visits</p>
            <p className="mt-2 text-sm text-gray-600">Last Week:</p>
            <p className="text-sm font-bold"> {totalVisitsLastWeek} visits</p>
            <div className="flex flex-col items-start">
                <p className="mt-2 text-sm text-gray-600">Change in Visitors</p>
                <div className="flex flex-row items-center justify-center w-full">
                    {ChangeIcon && <ChangeIcon className={`font-medium ${changeColor}`} />}
                    <p className={`text-sm font-bold ${changeColor}`}>
                        {percentageChangeInVisits}%
                    </p>
                </div>
            </div>
            </div>
            <div className="h-full w-full">
                <LineChart
                options={lineChartOptionsDailyComparison}
                series={chartData}
                />
            </div>
        </div>
        </Card>
    );
};

export default DailyComparison;

const lineChartOptionsDailyComparison = {
    legend: {
        show: false,
    },
    chart: {
      type: "line",
        toolbar: {
        show: false,
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "straight",
    },
    tooltip: {
        style: {
        fontSize: "12px",
        fontFamily: undefined,
        backgroundColor: "#000000",
        },
        theme: "dark",
        x: {
        format: "dd/MM/yy HH:mm",
        },
    },
    grid: {
        show: false,
    },
    xaxis: {
        axisBorder: {
        show: false,
        },
        axisTicks: {
        show: false,
        },
        labels: {
        style: {
            colors: "#A3AED0",
            fontSize: "12px",
            fontWeight: "500",
        },
        },
        type: "text",
        categories: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", ],
    },
    yaxis: {
        show: true,
        label: {
            show: true,
            style: {
                colors: "#A3AED0",
                fontSize: "12px",
                fontWeight: "500",
            },
        },
    },
};  