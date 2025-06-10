import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("dashboardAccessToken");
  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
