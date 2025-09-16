import axios from "axios";

// export const BASE_URL = "http://192.168.0.207:8000";
export const BASE_URL = "http://139.59.20.155:8000";
// export const BASE_URL = "https://theft-pure-jail-proposed.trycloudflare.com";
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

// Set token on app start (prioritizing dashboard token)
if (localStorage.getItem("dashboardAccessToken")) {
  setAuthToken("dashboard");
} else if (localStorage.getItem("accessToken")) {
  setAuthToken("access");
}

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      const isDashboardToken = axiosInstance.defaults.headers.common[
        "Authorization"
      ]?.includes(localStorage.getItem("dashboardAccessToken"));

      if (isDashboardToken) {
        localStorage.removeItem("dashboardAccessToken");
        localStorage.removeItem("dashboardRefreshToken");
        localStorage.removeItem("busFormData");
      } else {
        localStorage.removeItem("accessToken");
      }

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
