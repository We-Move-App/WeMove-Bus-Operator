import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./add-user.module.css";
import { FaUserLarge } from "react-icons/fa6";
import { MdAddCircle } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownMenu from "../Reusable/Drop-Down-Menu/DropdownMenu";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUsers = async () => {
    try {
      setUsers([]);
      const response = await axiosInstance.get("/bus-operator/members/all");
      console.log("API raw response:", response.data);
      const members = response.data?.data?.members || [];
      console.log("Parsed members:", members);
      setUsers(members);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();

    if (location.state?.shouldRefresh) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleAddUserClick = () => {
    navigate("/add-manage-user/user-management");
  };

  const handleEdit = async (user) => {
    try {
      const response = await axiosInstance.get(
        `/bus-operator/members/${user._id}`
      );
      console.log("Navigating with full user:", response.data.data);
      navigate("/add-manage-user/user-management", {
        state: { user: response.data.data },
      });
    } catch (error) {
      console.error("Error fetching full user:", error);
    }
  };

  const handleDelete = async (userId) => {
    console.log("Delete user with ID:", userId);

    try {
      const response = await axiosInstance.delete(
        `/bus-operator/members/${userId}`
      );
      console.log("User deleted successfully:", response.data.message);

      // Optionally update the UI by removing the user from the state
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className={styles.cardContainer}>
      {users.map((user) => (
        <div key={user._id} className={styles.card}>
          <div className={styles.menuContainer}>
            <DropdownMenu
              Icon={BsThreeDotsVertical}
              options={[
                { label: "Edit", onClick: () => handleEdit(user) },
                { label: "Delete", onClick: () => handleDelete(user._id) },
              ]}
            />
          </div>
          <div className={styles.branchName}>
            <FaUserLarge size={50} />
            <h3 className={styles.userName}>{user.fullName}</h3>
          </div>
        </div>
      ))}

      <div
        className={styles.card}
        onClick={handleAddUserClick}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.branchName}>
          <MdAddCircle size={50} />
          <h3>Add User</h3>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
