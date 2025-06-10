import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  let verificationStatus = null;
  try {
    if (token) {
      const decoded = jwtDecode(token);
      verificationStatus = decoded?.verificationStatus;
    }
  } catch (error) {
    console.error("Token decoding failed:", error);
  }

  if (token && location.pathname !== "/step") {
    if (verificationStatus === "submitted") {
      return <Navigate to="/step" replace />;
    }
    if (verificationStatus === "processing") {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PublicRoute;
