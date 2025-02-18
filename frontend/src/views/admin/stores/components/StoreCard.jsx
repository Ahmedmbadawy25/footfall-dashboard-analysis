const StoreCard = ({ store, onDelete }) => {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{store.name}</h3>
        <p className="text-gray-500 dark:text-gray-400">Owner: {store.owner}</p>
        <p className="text-gray-500 dark:text-gray-400">Location: {store.location}</p>
        <button
          onClick={() => onDelete(store.id)}
          className="mt-3 px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    );
  };
  
  export default StoreCard;
  