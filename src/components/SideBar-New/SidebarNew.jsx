import React from "react";
import {
  X,
  Home,
  Bus,
  Route,
  Users,
  Ticket,
  Wallet,
  UserPlus,
  MessageSquare,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./sidebar-new.module.css";

const SidebarNew = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, text: "Dashboard", path: "/dashboard" },
    { icon: Bus, text: "Bus Management", path: "/bus-management" },
    { icon: Route, text: "Route Management", path: "/route-management" },
    { icon: Users, text: "Driver Management", path: "/driver-management" },
    { icon: Ticket, text: "Ticket Management", path: "/ticket-management" },
    { icon: Wallet, text: "Wallet", path: "/wallet" },
    { icon: UserPlus, text: "Add/Manage User", path: "/add-manage-user" },
  ];

  const feedbackItem = {
    icon: MessageSquare,
    text: "Customer Feedback",
    path: "/feedback",
  };

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.open : ""}`}>
      <nav className={styles.nav}>
        {/* Container for main menu items */}
        <div className={styles.menuItems}>
          {menuItems.map((item, index) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/bus-management" &&
                location.pathname.startsWith("/bus-management"));

            return (
              <NavLink
                to={item.path}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                key={index}
              >
                {React.createElement(item.icon, { size: 20 })}
                <span className={styles.navText}>{item.text}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Separate div for Feedback */}
        <div className={styles.feedbackItem}>
          <NavLink
            to={feedbackItem.path}
            className={({ isActive }) => {
              return `${styles.navItem} ${isActive ? styles.active : ""}`;
            }}
          >
            {React.createElement(feedbackItem.icon, { size: 20 })}
            <span className={styles.navText}>{feedbackItem.text}</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default SidebarNew;
