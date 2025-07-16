import React, { useState, Suspense, useEffect } from "react";
import NavbarNew from "../Navbar-New/NavbarNew";
import SidebarNew from "../SideBar-New/SidebarNew";
import styles from "./layout-new.module.css";
import { Outlet } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { useLocation } from "react-router-dom";

const LayoutNew = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const handleResponsiveSidebar = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResponsiveSidebar();
  }, [location.pathname]);
  return (
    <div className={styles.layout}>
      <NavbarNew toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
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
