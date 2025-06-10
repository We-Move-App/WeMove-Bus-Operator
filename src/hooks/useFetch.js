import { useState, useCallback } from "react";
import axiosInstance from "../services/axiosInstance";

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useCallback(
    async (url, method = "GET", data = null, config = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance({
          url,
          method,
          data,
          ...config,
        });
        return response.data;
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  return { fetchData, loading, error };
};

export default useFetch;
