import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import images from "../../assets/image";
import styles from "./navbar-new.module.css";
import { MdOutlineExpandMore } from "react-icons/md";
import DropdownMenu from "../Reusable/Drop-Down-Menu/DropdownMenu";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axiosInstance, { setAuthToken } from "../../services/axiosInstance";

const NavbarNew = ({ toggleSidebar }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const avatarRes = await axiosInstance.get("/bus-operator/get-avatar");
        const profileRes = await axiosInstance.get("/bus-operator/profile");

        const avatarUrl = avatarRes?.data?.data?.url;
        const userName = profileRes?.data?.data?.user?.fullName;

        if (avatarUrl) setAvatarUrl(avatarUrl);
        if (userName) setName(userName);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };
    setAuthToken("dashboard");
    fetchProfileData();
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <button className={styles.menuButton} onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className={styles.logo}>
          <div className={styles.imageNavbar}>
            <img src={images.weMoveLogo} alt="we-move-logo" />
          </div>
          <h2>WeMove All.</h2>
        </div>
      </div>
      <div className={styles.navbarRightBlock}>
        <div className={styles.imageNameBlock}>
          <div className={styles.imageBlock}>
            {/* <img src={images.userImg} alt="user" /> */}
            <img src={avatarUrl || images.userImg} alt="user" />
          </div>
          <div className={styles.nameBlock}>
            <h2>{name || "User"}</h2>
          </div>
          <div className={styles.dropdownContainer}>
            <DropdownMenu
              Icon={MdOutlineExpandMore}
              options={[
                { label: "Profile", onClick: () => navigate("/profile") },
                { label: "Logout", onClick: handleLogout },
              ]}
            />
          </div>
        </div>
        <div className={styles.notificationBlock}>
          <img src={images.bellIcon} alt="bell-icon" />
        </div>
      </div>
    </nav>
  );
};

export default NavbarNew;
