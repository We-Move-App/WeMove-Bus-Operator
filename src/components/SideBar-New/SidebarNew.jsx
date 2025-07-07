import React from "react";
import {
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
import { useSelector } from "react-redux";

const SidebarNew = ({ isOpen }) => {
  const location = useLocation();
  const { role, permissions } = useSelector((state) => state.user);

  const menuItems = [
    {
      icon: Home,
      text: "Dashboard",
      path: "/dashboard",
      id: "dashboardManagement",
    },
    {
      icon: Bus,
      text: "Bus Management",
      path: "/bus-management",
      id: "busManagement",
    },
    {
      icon: Route,
      text: "Route Management",
      path: "/route-management",
      id: "routeManagement",
    },
    {
      icon: Users,
      text: "Driver Management",
      path: "/driver-management",
      id: "driverManagement",
    },
    {
      icon: Ticket,
      text: "Ticket Management",
      path: "/ticket-management",
      id: "ticketManagement",
    },
    {
      icon: Wallet,
      text: "Wallet",
      path: "/wallet",
      id: "walletManagement",
    },
    {
      icon: UserPlus,
      text: "Add/Manage User",
      path: "/add-manage-user",
      roleAccess: ["bus-operator"],
    },
  ];

  const feedbackItem = {
    icon: MessageSquare,
    text: "Customer Feedback",
    path: "/feedback",
  };

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.open : ""}`}>
      <nav className={styles.nav}>
        <div className={styles.menuItems}>
          {menuItems.map((item, index) => {
            const hasPermission = item.id ? permissions?.[item.id] : true;
            const hasRoleAccess = item.roleAccess
              ? item.roleAccess.includes(role)
              : true;

            if (hasPermission && hasRoleAccess) {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/bus-management" &&
                  location.pathname.startsWith("/bus-management"));

              return (
                <NavLink
                  to={item.path}
                  className={`${styles.navItem} ${
                    isActive ? styles.active : ""
                  }`}
                  key={index}
                >
                  {React.createElement(item.icon, { size: 20 })}
                  <span className={styles.navText}>{item.text}</span>
                </NavLink>
              );
            }

            return null;
          })}
        </div>

        {role === "bus-operator" && (
          <div className={styles.feedbackItem}>
            <NavLink
              to={feedbackItem.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              {React.createElement(feedbackItem.icon, { size: 20 })}
              <span className={styles.navText}>{feedbackItem.text}</span>
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default SidebarNew;
