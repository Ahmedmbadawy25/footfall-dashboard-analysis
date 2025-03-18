import React, { useState } from "react";
import Banner from "./components/Banner";
import StoreCard from "./components/StoreCard";
import CreateStoreModal from "./components/CreateStoreModal";
import { useStore } from "components/StoreContext";
import Widget from "components/widget/Widget";
import { makeRequest } from "fetcher";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { FaChartLine } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

const fetchWidgetData = async () => {
  const response = await makeRequest("GET", "/api/footfall/stores-page-widgets-data");
  if (response.status === '200') {
    const data = response.data
    return data
  }
  throw new Error("Failed to fetch widget data");
};

const StoreManager = () => {
  const [isCreateStoreModalOpen, setIsCreateStoreModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState(null)
  const { data: widgetData, isLoading, error } = useQuery({
    queryKey: ["storesWidgetData"],
    queryFn: fetchWidgetData,
    staleTime: 60 * 60 * 1000, // Cache for 30 minutes
    cacheTime: 60 * 60 * 1000,
  });
  const { stores, setStores } = useStore()

  const handleCreateStore = async (storeData) => {
    try {
      const response = await makeRequest('POST', '/api/stores', storeData)
      if (response.status === '201') {
        const newStore = response.data.store
        setStores([...stores, newStore]);
      }
      setIsCreateStoreModalOpen(false);
    } catch (error) {
      console.error("Failed to create store:", error);
    }
  };

  const handleDeleteStore = async () => {
    if (!storeToDelete) return;
    try {
      const response = await makeRequest('GET', `/api/stores/${storeToDelete}`)
      if (response.status === '200') {
        setStores(stores.filter((store) => store._id !== storeToDelete));
      }
    } catch (error) {
      console.error("Failed to delete store:", error);
    } finally {
      setStoreToDelete(null)
      setIsConfirmModalOpen(false)
    }
  };

  const confirmDelete = (storeId) => {
    setStoreToDelete(storeId);
    setIsConfirmModalOpen(true);
  };

  return (
    <div className="mt-3 h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        <Banner />

        <div className="mb-4 mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <Widget icon="🏬" title={"Total Stores"} subtitle={stores?.length || "N/A"} />
          <Widget icon="👣" title={"Total Footfall Today"} subtitle={widgetData?.totalFootfallToday || "N/A"} />
          <Widget icon="📊" title={"Average Footfall Today"} subtitle={widgetData?.averageFootfallPerStore || "N/A"} />
          <Widget icon={<MdTrendingUp className="h-7 w-7" />} title="Most Visited Store" subtitle={widgetData?.mostVisitedStore || "N/A"} />
          <Widget icon={<MdTrendingDown className="h-7 w-7" />} title="Least Visited Store" subtitle={widgetData?.leastVisitedStore || "N/A"} />
          <Widget icon={<FaChartLine className="h-7 w-7" />} title="Store with Most Growth" subtitle={widgetData?.mostGrowthStore || "N/A"} />
        </div>

        {/* Store Manager Header */}
        <div className="mb-4 flex flex-col justify-between px-4 md:flex-row md:items-center">
          <h4 className="ml-1 text-2xl font-bold text-navy-700 dark:text-white">
            Store Manager
          </h4>
          <button
            onClick={() => setIsCreateStoreModalOpen(true)}
            className="rounded-lg  px-4 py-2 text-sm font-medium  bg-white hover:bg-gray-100 text-navy-700 hover:text-navy-800 dark:text-white dark:hover:bg-white/20 dark:bg-navy-800"
          >
            Create New Store
          </button>
        </div>

        {/* List of Stores */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <StoreCard
              key={store._id}
              id={store._id}
              name={store.name}
              location={store.location}
              onDelete={() => confirmDelete(store._id)}
            />
          ))}
        </div>
      </div>

      <CreateStoreModal
        isOpen={isCreateStoreModalOpen}
        onClose={() => setIsCreateStoreModalOpen(false)}
        onCreate={handleCreateStore}
      />

      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-navy-900 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Confirm Deletion</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this store? This action is irreversible.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => {
                  setIsConfirmModalOpen(false) 
                  setStoreToDelete(null)
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDeleteStore}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManager;