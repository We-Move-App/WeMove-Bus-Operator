import axios from "axios";
import i18n from "@/i18n";

export const BASE_URL = "http://139.59.20.155:8000";
// export const BASE_URL =
//   "https://maximize-processes-similar-own.trycloudflare.com";
export const API_VERSION = "v1";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
});

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

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("dashboardAccessToken") ||
      localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.headers["x-language"] = i18n.language || "en";

    return config;
  },
  (error) => Promise.reject(error),
);

if (localStorage.getItem("dashboardAccessToken")) {
  setAuthToken("dashboard");
} else if (localStorage.getItem("accessToken")) {
  setAuthToken("access");
}

export default axiosInstance;
