import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("dashboardAccessToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const userData = JSON.parse(localStorage.getItem("userData"));

  const role = userData?.role;
  const permissions = userData?.permissions || {};

  const location = useLocation();

  // Full access for main operator
  if (role !== "bus-operator-member") {
    return children;
  }

  const path = location.pathname;

  // Route permission mapping
  const routePermissions = {
    "/dashboard": "dashboardManagement",
    "/bus-management": "busManagement",
    "/route-management": "routeManagement",
    "/driver-management": "driverManagement",
    "/ticket-management": "ticketManagement",
    "/wallet": "walletManagement",
  };

  const matchedRoute = Object.keys(routePermissions).find((route) =>
    path.startsWith(route),
  );

  if (matchedRoute) {
    const requiredPermission = routePermissions[matchedRoute];

    if (!permissions[requiredPermission]) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
