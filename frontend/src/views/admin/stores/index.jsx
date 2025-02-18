import { useState } from "react";
import Banner from "./components/Banner";
import StoreCard from "./components/StoreCard";
import StoreTable from "./components/StoreTable";
import StatsCard from "./components/StatsCard";

const StoreManager = () => {
  // Dummy store data (Replace with API call in real scenario)
  const [stores, setStores] = useState([
    { id: 1, name: "ElectroHub", owner: "Ali Hassan", location: "Cairo" },
    { id: 2, name: "FashionWave", owner: "Sarah Ahmed", location: "Alexandria" },
    { id: 3, name: "MegaMart", owner: "Omar Khaled", location: "Giza" },
  ]);

  const addStore = () => {
    const newStore = {
      id: stores.length + 1,
      name: `New Store ${stores.length + 1}`,
      owner: "Unknown",
      location: "TBD",
    };
    setStores([...stores, newStore]);
  };

  const deleteStore = (id) => {
    setStores(stores.filter((store) => store.id !== id));
  };

  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        {/* Page Banner */}
        <Banner title="Store Manager" subtitle="Manage and oversee all stores efficiently" />

        {/* Store Actions */}
        <div className="mb-4 mt-5 flex justify-between px-4">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">All Stores</h4>
          <button
            onClick={addStore}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            + Add Store
          </button>
        </div>

        {/* Store List */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} onDelete={deleteStore} />
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="col-span-1 h-full w-full rounded-xl 2xl:col-span-1">
        {/* Store Stats Overview */}
        <StatsCard totalStores={stores.length} />

        {/* Store Table View */}
        <StoreTable stores={stores} onDelete={deleteStore} />
      </div>
    </div>
  );
};

export default StoreManager;
