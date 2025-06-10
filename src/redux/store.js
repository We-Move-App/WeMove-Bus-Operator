import { configureStore } from "@reduxjs/toolkit";
import busReducer from "./slices/busSlice";
import driverReducer from "./slices/driverSlice";

const store = configureStore({
  reducer: {
    bus: busReducer,
    driver: driverReducer,
  },
});

export default store;
