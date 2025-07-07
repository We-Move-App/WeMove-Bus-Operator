import { configureStore } from "@reduxjs/toolkit";
import busReducer from "./slices/busSlice";
import driverReducer from "./slices/driverSlice";
import userReducer from "./slices/userSlice";


const store = configureStore({
  reducer: {
    bus: busReducer,
    driver: driverReducer,
    user: userReducer,
  },
});

export default store;
