import React from "react";

const StoreCard = ({ id, name, location, onDelete }) => {
  return (
    <div className="rounded-xl bg-white p-4 shadow-lg dark:bg-navy-700">
      <h3 className="text-xl font-bold text-navy-700 dark:text-white">{name}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{location}</p>
      <button
        onClick={() => onDelete(id)}
        className="mt-4 rounded-lg bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
      >
        Delete Store
      </button>
    </div>
  );
};

export default StoreCard;