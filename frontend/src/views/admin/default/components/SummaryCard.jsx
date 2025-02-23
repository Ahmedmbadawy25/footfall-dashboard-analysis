import React, { useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import Card from "components/card";
import Dropdown from "components/dropdown";

const SummaryCard = () => {
    const [summaryType, setSummaryType] = useState("Daily");

    // Example summary data (this should be dynamically fetched)
    const summaryData = {
        Daily: [
        { task: "Landing Page Design", completed: true },
        { task: "Mobile App Design", completed: false },
        { task: "Dashboard Builder", completed: true },
        ],
        Weekly: [
        { task: "Website Revamp", completed: true },
        { task: "Marketing Strategy", completed: false },
        { task: "Client Reports", completed: true },
        ],
        Monthly: [
        { task: "System Upgrade", completed: false },
        { task: "Hiring Process", completed: true },
        { task: "Q1 Planning", completed: true },
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
                {summaryType} <MdArrowDropDown className="h-6 w-6"/>
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

        {/* Task List */}
        <div className="h-full w-full">
            {summaryData[summaryType].map((item, index) => (
            <div
                key={index}
                className="mt-2 flex items-center justify-between p-2"
            >
                <div className="flex items-center font-bold justify-center gap-2">
                -
                <p className="text-base font-bold text-navy-700 dark:text-white">
                    {item.task}
                </p>
                </div>
            </div>
            ))}
        </div>
        </Card>
    );
};

export default SummaryCard;
