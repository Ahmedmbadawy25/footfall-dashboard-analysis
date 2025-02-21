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
  const { data: widgetData, isLoading, error } = useQuery({
    queryKey: ["storesWidgetData"],
    queryFn: fetchWidgetData,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
    cacheTime: 30 * 60 * 1000,
  });
  const { stores, setStores } = useStore()

  const handleCreateStore = async (storeData) => {
    try {
      const response = await makeRequest('POST', '/api/stores', storeData)
      const newStore = response.data.store
      setStores([...stores, newStore]);
      setIsCreateStoreModalOpen(false);
    } catch (error) {
      console.error("Failed to create store:", error);
    }
  };

  const handleDeleteStore = async (storeId) => {
    try {
      const response = await makeRequest('GET', `/api/stores/${storeId}`)
      if (response.status === '200') {
        setStores(stores.filter((store) => store._id !== storeId));
      }
    } catch (error) {
      console.error("Failed to delete store:", error);
    }
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
              onDelete={handleDeleteStore}
            />
          ))}
        </div>
      </div>

      <CreateStoreModal
        isOpen={isCreateStoreModalOpen}
        onClose={() => setIsCreateStoreModalOpen(false)}
        onCreate={handleCreateStore}
      />
    </div>
  );
};

export default StoreManager;