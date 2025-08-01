import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridBlock from "../Reusable/Grid-Block/GridBlock";
import styles from "./bus-grid.module.css";
import images from "../../assets/image";
import useFetch from "../../hooks/useFetch";
import { setBusData } from "../../redux/slices/busSlice";
import { Skeleton } from "@mui/material";

const BusGrid = () => {
  const dispatch = useDispatch();
  const { fetchData, loading, error } = useFetch();
  const busData = useSelector((state) => state.bus?.formData) || [];

  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const getBuses = async () => {
      try {
        const response = await fetchData("/bus-operator/buses/my-buses");
        const fetchedBuses = response?.data?.buses || [];
        setBuses(fetchedBuses);
        dispatch(setBusData(fetchedBuses));
      } catch (err) {
        console.error("Error fetching buses:", err);
      }
    };
    getBuses();
  }, [fetchData, dispatch]);

  return (
    <div className={styles.gridContainer}>
      {loading ? (
        // Show 4 skeletons matching GridBlock layout
        Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.gridBlock}>
            <div className={styles.imageContainer}>
              <Skeleton variant="rectangular" width="100%" height={140} />
            </div>
            <div className={styles.content}>
              <Skeleton variant="text" width="80%" height={30} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="50%" />
            </div>
          </div>
        ))
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
