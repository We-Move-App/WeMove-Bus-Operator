import axios from "axios";

export const BASE_URL = "http://139.59.20.155:8000";
// export const BASE_URL =
//   "https://fairly-story-floyd-monitoring.trycloudflare.com";
export const API_VERSION = "v1";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Dynamically set Authorization header from token type
 * @param {"access" | "dashboard"} type
 */
export const setAuthToken = (type = "access") => {
  const tokenKey =
    type === "dashboard" ? "dashboardAccessToken" : "accessToken";

  const token = localStorage.getItem(tokenKey);

  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

if (localStorage.getItem("dashboardAccessToken")) {
  setAuthToken("dashboard");
} else if (localStorage.getItem("accessToken")) {
  setAuthToken("access");
}

export default axiosInstance;
