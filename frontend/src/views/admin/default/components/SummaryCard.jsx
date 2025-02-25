import React, { useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import Card from "components/card";
import Dropdown from "components/dropdown";

const SummaryCard = () => {
    const [summaryType, setSummaryType] = useState("Daily");

    const summaryData = {
        Daily: [
            { label: "Total visits today", value: "1,200" },
            { label: "Busiest hour today", value: "14:00 - 15:00 (300 visits)" },
            { label: "Typical busiest hour on Monday", value: "13:00 - 14:00 (250 visits)" },
            { label: "Visitor change vs last week", value: "⬆️ 12% increase" },
        ],
        Weekly: [
            { label: "Total visits this week", value: "8,500" },
            { label: "Busiest day this week", value: "Saturday (2,100 visits)" },
            { label: "Visitor change on Thursday", value: "Increased from 1,200 to 1,400" },
            { label: "Typical busiest day", value: "Friday (2,300 visits)" },
        ],
        Monthly: [
            { label: "Total visits this month", value: "32,000" },
            { label: "Busiest week this month", value: "Week 2 (9,000 visits)" },
            { label: "Visitor change vs last month", value: "⬆️ Increased from 28,000 to 32,000" },
            { label: "Typical busiest week", value: "Week 3 (9,500 visits)" },
        ],
    };

    return (
        <Card extra="pb-7 p-[20px]">
            {/* Header with Dropdown */}
            <div className="relative flex flex-row justify-between">
                <div className="flex items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lightPrimary dark:bg-navy-700 dark:bg-white/5">
                        <FaClipboardList className="h-6 w-6 text-brand-500 dark:text-white" />
                    </div>
                    <h4 className="ml-4 text-xl font-bold text-navy-700 dark:text-white">
                        {summaryType} Summary
                    </h4>
                </div>

                {/* Dropdown for Summary Selection */}
                <Dropdown
                    button={
                        <button className="mr-2 py-1 flex items-center justify-center text-sm font-bold text-gray-600 hover:cursor-pointer dark:!bg-navy-800 dark:text-white">
                            {summaryType} <MdArrowDropDown className="h-6 w-6" />
                        </button>
                    }
                    classNames="top-8 right-0 w-max"
                    children={
                        <div className="z-50 w-max rounded-xl bg-white py-3 px-4 text-sm shadow-xl dark:!bg-navy-700">
                            {["Daily", "Weekly", "Monthly"].map((type) => (
                                <p
                                    key={type}
                                    className="cursor-pointer hover:text-black text-gray-600 hover:font-medium pt-2"
                                    onClick={() => setSummaryType(type)}
                                >
                                    {type}
                                </p>
                            ))}
                        </div>
                    }
                />
            </div>

            {/* Summary Data Display */}
            <div className="h-full w-full">
                {summaryData[summaryType].map((item, index) => (
                    <div key={index} className="mt-2 flex items-center justify-between p-2">
                        <div className="flex items-center font-bold justify-center gap-2">
                            -
                            <p className="text-base font-bold text-navy-700 dark:text-white">
                                {item.label}:
                            </p>
                        </div>
                        <p className="text-base font-bold text-brand-500 dark:text-lightPrimary">
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default SummaryCard;