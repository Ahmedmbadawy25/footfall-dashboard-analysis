import React, { useState } from "react";

const CreateStoreModal = ({ isOpen, onClose, onCreate }) => {
  const [storeData, setStoreData] = useState({
    name: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData({ ...storeData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(storeData);
    setStoreData({name: "", location: ""})
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900 bg-opacity-50">
      <div className="w-11/12 max-w-md rounded-lg bg-lightPrimary p-6 shadow-lg dark:bg-navy-700">
        <h2 className="text-xl font-bold text-navy-700 dark:text-white">
          Create New Store
        </h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-navy-700 dark:text-white">
              Store Name
            </label>
            <input
              type="text"
              name="name"
              value={storeData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-navy-700 dark:text-white">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={storeData.location}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800 dark:text-white"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-navy-700 hover:bg-gray-100 w-full dark:text-white dark:bg-navy-900 dark:hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-navy-700 hover:bg-gray-100 w-full dark:text-white dark:bg-navy-900 dark:hover:bg-white/20"
            >
              Create Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoreModal;