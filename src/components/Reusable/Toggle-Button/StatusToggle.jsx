import { Switch } from "@mui/material";
import React, { useState } from "react";

const StatusToggle = ({ initialStatus = "active", onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus === "active");

  const handleToggle = () => {
    const newStatus = !status;
    setStatus(newStatus);
    onStatusChange(newStatus ? "active" : "inactive");
  };

  return <Switch checked={status} onChange={handleToggle} color="success" />;
};

export default StatusToggle;
