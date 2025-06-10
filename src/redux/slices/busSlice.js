import { createSlice } from "@reduxjs/toolkit";
import images from "../../assets/image";

const initialState = {
  formData: {
    _id: "",
    busImages: [],
    busName: "",
    busModelNumber: "",
    busRegNumber: "",
    assignedDriver: null,
    status: "active",
    amenities: [],
    runningDays: [],
    busLicenseFront: null,
    rating: 1,
    routes: [],
  },
  step: 1,
};

export const availableAmenities = [
  { name: "A/C", icon: images.acOn },
  { name: "Non A/C", icon: images.acOff },
  { name: "Wifi", icon: images.wifi },
  { name: "Pillow", icon: images.pillow },
];

// Normalize amenities to store only names
const normalizeAmenities = (amenities) => {
  if (!Array.isArray(amenities)) return [];
  return amenities.map((amenity) => ({
    name:
      typeof amenity?.name === "string" ? amenity.name : String(amenity?.name),
  }));
};

const busSlice = createSlice({
  name: "bus",
  initialState,
  reducers: {
    setBusData: (state, action) => {
      if (typeof action.payload !== "object") {
        return;
      }

      const busData = action.payload?.newBus ?? action.payload;
      // console.log("Dispatching setBusData with payload:", action.payload);
      // console.log("Extracted busData:", busData);

      state.formData = {
        ...state.formData,
        _id: busData._id || "",
        busName: busData.busName || "",
        busModelNumber: busData.busModelNumber || "",
        busRegNumber: busData.busRegNumber || "",
        assignedDriver: busData.assignedDriver || null,
        status: busData.status || "active",
        amenities: normalizeAmenities(busData.amenities || []),
        runningDays: busData.runningDays || [],
        busImages: busData.busImages || [],
        rating: busData.rating || 1,
        busLicenseFront: busData.busLicenseFront || null,
        routes: Array.isArray(busData.routes)
          ? busData.routes
          : state.formData.routes,
      };
      // console.log("Updated Redux state:", state.formData);
    },

    addRouteData: (state, action) => {
      const newRoute = action.payload;

      if (!newRoute) {
        return;
      }
      // console.log("Adding Route:", action.payload);

      state.formData.routes = [...state.formData.routes, newRoute];
    },

    setStep: (state, action) => {
      if (typeof action.payload !== "number") return;
      // console.log("Step Change Triggered:", action.payload);
      state.step = action.payload;
      // console.log("Current Step:", state.step);
    },

    updateFormData: (state, action) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },

    resetBusData: (state) => {
      // console.log("Resetting Bus Data...");
      state.formData = { ...initialState.formData };
      state.step = 1;
    },
  },
});

export const {
  setBusData,
  addRouteData,
  setStep,
  resetBusData,
  updateFormData,
} = busSlice.actions;
export default busSlice.reducer;
