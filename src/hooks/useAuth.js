import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { useDispatch } from "react-redux";
import { setBusData } from "../redux/slices/busSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //   const handleLogout = async () => {
  //     try {
  //       await axiosInstance.post("/auth/logout");
  //       localStorage.removeItem("accessToken");
  //       localStorage.removeItem("refreshToken");
  //       navigate("/");
  //     } catch (error) {
  //       console.error("Logout failed:", error.response?.data || error.message);
  //     }
  //   };

  const handleLogout = () => {
    dispatch(setBusData({}));

    localStorage.removeItem("dashboardAccessToken");
    localStorage.removeItem("dashboardRefreshToken");
    console.log("User logged out. Cleared bus data");
    navigate("/", { replace: true });
  };

  return { handleLogout };
};

export default useAuth;
