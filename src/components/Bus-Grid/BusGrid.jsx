import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridBlock from "../Reusable/Grid-Block/GridBlock";
import styles from "./bus-grid.module.css";
import images from "../../assets/image";
import useFetch from "../../hooks/useFetch";
import { setBusData } from "../../redux/slices/busSlice";

const BusGrid = () => {
  const dispatch = useDispatch();
  const { fetchData, loading, error } = useFetch();
  const busData = useSelector((state) => state.bus?.formData) || [];

  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const getBuses = async () => {
      try {
        const response = await fetchData("/bus-operator/buses/my-buses");
        // console.log("API Response:", response);

        const fetchedBuses = response?.data?.buses || [];
        setBuses(fetchedBuses);
        dispatch(setBusData(fetchedBuses));
      } catch (err) {
        console.error("Error fetching buses:", err);
      }
    };
    getBuses();
  }, [fetchData, dispatch]);

  // useEffect(() => {
  //   console.log("Buses state updated:", buses);
  // }, [buses]);

  // useEffect(() => {
  //   console.log("Redux store formData:", busData);
  // }, [busData]);

  return (
    <div className={styles.gridContainer}>
      {!loading && !error && buses.length > 0 ? (
        buses.map((bus) => (
          <GridBlock
            key={bus._id}
            _id={bus._id}
            image={bus.busImages?.url || images.bus1}
            busName={bus.busName}
            modelNumber={bus.busModelNumber}
            regNumber={bus.busRegNumber}
            driver={bus.assignedDriver?.fullName || "Not Assigned"}
          />
        ))
      ) : (
        <p>No bus data available</p>
      )}
    </div>
  );
};

export default BusGrid;
