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
      dispatch(setBusData(storedBusData));
    } else {
      console.warn("⚠️ No valid bus data found in localStorage.");
    }
  }, [dispatch]);

  //Save to localStorage whenever Redux state updates
  useEffect(() => {
    if (busFormData && busFormData._id) {
      localStorage.setItem("busFormData", JSON.stringify(busFormData));
    }
  }, [busFormData]);
  return (
    <>
      <AppRoutes />
    </>
  );
};

export default App;
