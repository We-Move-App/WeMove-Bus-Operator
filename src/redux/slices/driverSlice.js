import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drivers: [],
  selectedDriver: null,
};

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    setDrivers: (state, action) => {
      state.drivers = action.payload;
    },
    addDriver: (state, action) => {
      state.drivers.push(action.payload);
    },
    updateDriver: (state, action) => {
      const index = state.drivers.findIndex(
        (driver) => driver._id === action.payload._id
      );
      if (index !== -1) {
        state.drivers[index] = action.payload;
      }
    },
    deleteDriver: (state, action) => {
      state.drivers = state.drivers.filter(
        (driver) => driver._id !== action.payload
      );
    },
    selectDriver: (state, action) => {
      state.selectedDriver = action.payload;
    },
  },
});

export const {
  setDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  selectDriver,
} = driverSlice.actions;
export default driverSlice.reducer;
