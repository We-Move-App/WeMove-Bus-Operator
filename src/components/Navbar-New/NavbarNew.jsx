import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import images from "../../assets/image";
import styles from "./navbar-new.module.css";
import { MdOutlineExpandMore } from "react-icons/md";
import DropdownMenu from "../Reusable/Drop-Down-Menu/DropdownMenu";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axiosInstance, { setAuthToken } from "../../services/axiosInstance";
import { useDispatch } from "react-redux";
import { setUserRoleAndPermissions } from "../../redux/slices/userSlice";
import LanguageSelector from "../GoogleTranslate/LanguageSelector";
import { BadgeCheck } from "lucide-react";

const NavbarNew = ({ isSidebarOpen, toggleSidebar }) => {
  const [name, setName] = useState("");
  const [badge, setBadge] = useState("");
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const avatarRes = await axiosInstance.get("/bus-operator/get-avatar");
        const profileRes = await axiosInstance.get("/bus-operator/profile");

        const avatarUrl = avatarRes?.data?.data?.url;
        const user = profileRes?.data?.data?.user;
        const badge = profileRes?.data?.data?.user?.batchVerified;
        console.log("Badge status", badge);

        if (badge) setBadge(badge);
        if (avatarUrl) setAvatarUrl(avatarUrl);
        if (user?.fullName) setName(user.fullName);
        if (user?.companyName) {
          localStorage.setItem("companyName", user.companyName);
        }

        dispatch(
          setUserRoleAndPermissions({
            role: user.role,
            permissions: user.permissions,
          }),
        );
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
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
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
          <div className={styles.languageSelectorWrapper}>
            <LanguageSelector />
          </div>
          <div className={styles.imageBlock}>
            <img src={avatarUrl || images.userImg} alt="user" />
          </div>
          <div className={styles.nameBlock}>
            <h2>{name || "User"}</h2>
            {badge && <BadgeCheck size={18} color="#4CAF50" title="Verified" />}
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
