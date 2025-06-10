import React, { useState, Suspense } from "react";
import NavbarNew from "../Navbar-New/NavbarNew";
import SidebarNew from "../SideBar-New/SidebarNew";
import styles from "./layout-new.module.css";
import { Outlet } from "react-router-dom";
import { FadeLoader } from "react-spinners";

const LayoutNew = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.layout}>
      <NavbarNew toggleSidebar={toggleSidebar} />
      <SidebarNew isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <main className={`${styles.main} ${isSidebarOpen ? styles.shifted : ""}`}>
        <Suspense
          fallback={
            <div className={styles.loaderWrapper}>
              <FadeLoader color="#3498db" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default LayoutNew;
