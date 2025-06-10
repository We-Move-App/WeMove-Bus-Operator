import React from "react";
import "./App.css";
import AppRoutes from "./routes/Routes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBusData } from "./redux/slices/busSlice";

const App = () => {
  const dispatch = useDispatch();
  const busFormData = useSelector((state) => state.bus.formData);
  useEffect(() => {
    const storedBusData = JSON.parse(localStorage.getItem("busFormData"));

    if (storedBusData && storedBusData._id) {
      // console.log("Loaded bus form data from localStorage:", storedBusData);
      dispatch(setBusData(storedBusData));
    } else {
      console.warn("⚠️ No valid bus data found in localStorage.");
    }
  }, [dispatch]);

  //Save to localStorage whenever Redux state updates
  useEffect(() => {
    if (busFormData && busFormData._id) {
      localStorage.setItem("busFormData", JSON.stringify(busFormData));
    } else {
      // console.warn("⚠️ Not saving to localStorage due to missing _id");
    }
  }, [busFormData]); // Only update when formData changes
  return (
    <>
      <AppRoutes />
    </>
  );
};

export default App;
