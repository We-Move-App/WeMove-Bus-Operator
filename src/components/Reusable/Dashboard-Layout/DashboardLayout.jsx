import React, { useState } from "react";
import styles from "./dashboard-layout.module.css";
// import SideBar from "../../SideBar/SideBar";

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1200);

  return (
    <div
      className={`${styles.dashboardContainer} ${
        isCollapsed ? styles.collapsed : ""
      }`}
    >
      <SideBar onToggle={setIsCollapsed} />
      <div
        className={`${styles.contentArea} ${
          isCollapsed ? styles.collapsed : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
