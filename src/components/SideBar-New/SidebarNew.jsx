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
import { useTranslation } from "react-i18next";

const SidebarNew = ({ isOpen, toggle }) => {
  const location = useLocation();
  const { role, permissions } = useSelector((state) => state.user);
  const { t } = useTranslation();

  const menuItems = [
    {
      icon: Home,
      text: t("sidebar.dashboard"),
      path: "/dashboard",
      id: "dashboardManagement",
    },
    {
      icon: Bus,
      text: t("sidebar.busManagement"),
      path: "/bus-management",
      id: "busManagement",
    },
    {
      icon: Route,
      text: t("sidebar.routeManagement"),
      path: "/route-management",
      id: "routeManagement",
    },
    {
      icon: Users,
      text: t("sidebar.driverManagement"),
      path: "/driver-management",
      id: "driverManagement",
    },
    {
      icon: Ticket,
      text: t("sidebar.ticketManagement"),
      path: "/ticket-management",
      id: "ticketManagement",
    },
    {
      icon: Wallet,
      text: t("sidebar.wallet"),
      path: "/wallet",
      id: "walletManagement",
    },
    {
      icon: UserPlus,
      text: t("sidebar.addManageUser"),
      path: "/add-manage-user",
      roleAccess: ["bus-operator"],
    },
  ];

  const feedbackItem = {
    icon: MessageSquare,
    text: t("sidebar.customerFeedback"),
    path: "/feedback",
  };

  return (
    // <aside className={`${styles.sidebar} ${!isOpen ? styles.open : ""}`}>
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
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
                  onClick={() => {
                    if (window.innerWidth < 1024) toggle();
                  }}
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
              onClick={toggle}
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
