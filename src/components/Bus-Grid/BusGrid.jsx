// BusGrid.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridBlock from "../Reusable/Grid-Block/GridBlock";
import styles from "./bus-grid.module.css";
import images from "../../assets/image";
import useFetch from "../../hooks/useFetch";
import { setBusData } from "../../redux/slices/busSlice";
import { Skeleton } from "@mui/material";

const BusGrid = ({ filters, currentPage, setTotalPages }) => {
  const dispatch = useDispatch();
  const { fetchData, loading, error } = useFetch();
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const getBuses = async () => {
      try {
        const response = await fetchData(
          "/bus-operator/buses/my-buses",
          "GET",
          null,
          {
            params: {
              page: currentPage, // pass current page
              limit: 4, // backend may support pagination size
              ...filters, // add search filters
            },
          }
        );

        const fetchedBuses = response?.data?.buses || [];
        setBuses(fetchedBuses);
        dispatch(setBusData(fetchedBuses));

        // use totalPages directly from API
        const pages = response?.data?.totalPages || 1;
        setTotalPages(pages);
      } catch (err) {
        console.error("Error fetching buses:", err);
      }
    };

    getBuses();
  }, [fetchData, dispatch, filters, currentPage, setTotalPages]);

  return (
    <div className={styles.gridContainer}>
      {loading ? (
        <p>Loading...</p>
      ) : !error && buses.length > 0 ? (
        buses.map((bus) => (
          <GridBlock
            key={bus._id}
            _id={bus._id}
            image={bus.busImages?.url || images.bus1}
            busName={bus.busName}
            modelNumber={bus.busModelNumber}
            regNumber={bus.busRegNumber}
            driver={
              bus.assignedDriver?.length > 0
                ? bus.assignedDriver.map((d) => d.fullName).join(", ")
                : "Not Assigned"
            }
          />
        ))
      ) : (
        <p>No bus data available</p>
      )}
    </div>
  );
};

export default BusGrid;
