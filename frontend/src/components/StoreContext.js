import React, { createContext, useState, useContext, useCallback } from "react";
import { makeRequest } from '../fetcher';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [storeId, setStoreId] = useState(null);
  const [stores, setStores] = useState([]);

  const fetchStores = useCallback(async () => {
    try {
      const response = await makeRequest('GET', "/api/stores");
      const data = response.data.data
      if (data.length > 0 && !storeId) {
        setStoreId(data[0]._id);
      }
      setStores(data);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  }, [storeId]);

  return (
    <StoreContext.Provider value={{ storeId, setStoreId, stores, fetchStores }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);