import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PublicRoute = ({ children }) => {
  const rawToken = localStorage.getItem("accessToken");
  const token = rawToken?.trim(); // remove accidental whitespace
  const location = useLocation();

  let verificationStatus = null;

  try {
    if (token && token.split(".").length === 3) {
      const decoded = jwtDecode(token);
      verificationStatus = decoded?.verificationStatus;
    } else if (token) {
      console.warn("Invalid token format:", token);
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
