const StatsCard = ({ totalStores }) => {
    return (
      <div className="p-4 bg-blue-500 text-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Store Overview</h3>
        <p className="text-2xl font-bold">{totalStores}</p>
        <p>Total Stores</p>
      </div>
    );
  };
  
  export default StatsCard;
  