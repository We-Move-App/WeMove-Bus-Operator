import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import ContentHeading from "../../components/Reusable/Content-Heading/ContentHeading";
import images from "../../assets/image";
import InputField from "../../components/Reusable/Input-Field/InputField";
import CustomBtn from "../../components/Reusable/Custom-Button/CustomBtn";
import UploadFile from "../../components/Reusable/UploadFile/UploadFile";
import SnackbarNotification from "../../components/Reusable/Snackbar-Notification/SnackbarNotification";
import axiosInstance, { setAuthToken } from "../../services/axiosInstance";
import { FadeLoader } from "react-spinners";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bank, setBank] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bankFetchFailed, setBankFetchFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    bankDocs: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("dashboardAccessToken");
    if (savedToken) {
      const decodedToken = jwtDecode(savedToken);
      setUserId(decodedToken._id);
      // console.log(decodedToken._id);
      setAuthToken("dashboard");
    }
  }, []);

  // Fetch user profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axiosInstance.get("/bus-operator/profile");
        setUser(userRes.data?.data?.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }

      try {
        const bankRes = await axiosInstance.get("/bus-operator/banks");
        const bankData = bankRes.data?.data?.bank || null;

        if (bankData) {
          setBank(bankData);
          setFormData({
            bankName: bankData.bankName || "",
            accountNumber: bankData.accountNumber || "",
            accountHolderName: bankData.accountHolderName || "",
            bankDocs: null,
          });
        } else {
          setBank(null);
          setBankFetchFailed(true);
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Failed to fetch bank data:", error);
        setBankFetchFailed(true);
        setIsEditing(true);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // console.log("File received:", file);
      if (file instanceof File && file.type.startsWith("image/")) {
        setFormData((prev) => ({
          ...prev,
          bankDocs: file,
        }));
      } else {
        alert("Please upload a valid image file");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();
      data.append("bankName", formData.bankName);
      data.append("accountNumber", formData.accountNumber);
      data.append("accountHolderName", formData.accountHolderName);

      if (formData.bankDocs) {
        data.append("bank_detail", formData.bankDocs);
      }

      let response;

      if (bank === null) {
        // First-time add bank (POST)
        response = await axiosInstance.post("/bus-operator/banks", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Edit existing bank (PUT)
        response = await axiosInstance.put(
          `/bus-operator/banks/${userId}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      // Fetch updated bank data
      const updatedBankRes = await axiosInstance.get("/bus-operator/banks");
      const updatedBank = updatedBankRes.data?.data?.bank || null;

      setBank(updatedBank);
      setFormData({
        bankName: updatedBank?.bankName || "",
        accountNumber: updatedBank?.accountNumber || "",
        accountHolderName: updatedBank?.accountHolderName || "",
        bankDocs: null,
      });

      setSnackbar({
        open: true,
        message:
          bank === null
            ? "Bank details added successfully!"
            : "Bank details updated successfully!",
        severity: "success",
      });

      setIsEditing(false);
      setBankFetchFailed(false);
    } catch (error) {
      console.error("Failed to save bank details:", error);
      setSnackbar({
        open: true,
        message: "Failed to save bank details.",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <FadeLoader color="#123abc" />
      </div>
    );
  }

  return (
    <div>
      <ContentHeading heading="Profile" showSubHeading={false} />
      <section className={styles.profileContainer}>
        <div className={styles.profileHalves}>
          {/* Left Half - User Details */}
          <div className={styles.leftHalf}>
            <div className={styles.imageBlockUser}>
              <img src={user?.avatar?.url || images.userImg} alt="user" />
            </div>
            <div className={styles.userDetails}>
              <div className={styles.title}>
                <h3>Personal Details</h3>
              </div>
              <div className={styles.contentBlock}>
                <div className={styles.name}>
                  <h4>{user?.fullName || "Loading..."}</h4>
                </div>
                <div className={styles.num}>
                  <h4>{user?.phoneNumber || "Loading..."}</h4>
                </div>
                <div className={styles.emailDetails}>
                  <h4>{user?.email || "Loading..."}</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Right Half - Bank Details */}
          <div className={styles.rightHalf}>
            <div className={styles.heading}>
              {/* <h3>{bankFetchFailed ? "Add Bank" : "Saved Bank"}</h3> */}
              <h3>
                {bankFetchFailed
                  ? "Add Bank"
                  : isEditing
                  ? "Edit Bank"
                  : "Saved Bank"}
              </h3>
            </div>
            <div className={styles.inputFieldsContainer}>
              <InputField
                label="Bank Name"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <InputField
                label="Bank Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <InputField
                label="Account Holder Name"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <UploadFile
                id="bankDocsUpload"
                label="Bank Account Details"
                className="customUpload"
                wrapperClassName="uploadWrapperStyle1"
                onChange={handleFileChange}
                textMode={isEditing ? "edit" : "view"}
                fileName={
                  bank?.bankDocs?.fileName ||
                  formData.bankDocs?.name ||
                  "No file uploaded"
                }
                url={bank?.bankDocs?.url || ""}
              />
            </div>

            {/* Button aligned with rightHalf */}
            <div className={styles.btnContainer}>
              <CustomBtn
                label={bankFetchFailed ? "Save" : isEditing ? "Update" : "Edit"}
                onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
              />
            </div>
          </div>
        </div>
      </section>
      <SnackbarNotification
        snackbar={snackbar}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
};

export default Profile;
