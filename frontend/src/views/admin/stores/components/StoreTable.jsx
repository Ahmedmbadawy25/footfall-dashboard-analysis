import React from "react";
import Card from "components/card";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

function StoresTable({ storesData }) {
  const [sorting, setSorting] = React.useState([]);
  const data = React.useMemo(() => [...storesData], [storesData]);

  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">STORE NAME</p>,
      cell: (info) => (
        <div className="flex items-center gap-3">
          <img src={info.getValue().logo} className="h-8 w-8 rounded-full" alt="" />
          <p className="text-sm font-medium text-navy-700 dark:text-white">{info.getValue().name}</p>
        </div>
      ),
    }),
    columnHelper.accessor("location", {
      id: "location",
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">LOCATION</p>,
      cell: (info) => <p className="text-sm text-gray-600 dark:text-white">{info.getValue()}</p>,
    }),
    columnHelper.accessor("sales", {
      id: "sales",
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">TOTAL SALES</p>,
      cell: (info) => <p className="text-sm font-medium text-navy-700 dark:text-white">${info.getValue()}</p>,
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">STATUS</p>,
      cell: (info) => {
        const status = info.getValue();
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status === "Active"
                ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
                : "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
            }`}
          >
            {status}
          </span>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <Card extra="mt-3 !z-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-3xl p-4 border-b border-gray-200 dark:border-white/10">
        <h3 className="text-lg font-bold text-navy-700 dark:text-white">Stores</h3>
        <button className="linear rounded-xl bg-lightPrimary px-4 py-2 text-sm font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
          See all
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-white/10">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-xs font-medium uppercase text-gray-500 dark:text-white">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-navy-700 transition">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-gray-700 dark:text-white">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default StoresTable;
