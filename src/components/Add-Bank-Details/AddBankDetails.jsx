import React, { useState } from "react";
import LogInLeft from "../Reusable/LogInLeft";
import RightSection from "../Reusable/RightSection";
import InputForm from "../Reusable/Form/InputForm";
import LogInBtn from "../Button/LogInBtn";
import UploadFile from "../Reusable/UploadFile/UploadFile";
import axiosInstance from "../../services/axiosInstance";

const AddBankDetails = () => {
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    bankFile: null,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    setFormData({
      ...formData,
      bankFile: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bankFile) {
      alert("Please upload a bank document");
      return;
    }

    const data = new FormData();
    data.append("accountHolderName", formData.accountHolderName);
    data.append("accountNumber", formData.accountNumber);
    data.append("bankName", formData.bankName);
    data.append("bank_detail", formData.bankFile);

    console.log("FormData content:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axiosInstance.post("/bus-operator/banks", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Success:", response.data);
      alert("Bank details added successfully!");
    } catch (error) {
      console.error("API error:", error);
      alert(
        error?.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="logInSection">
      <LogInLeft />
      <div className="rightSectionContainer">
        <div className="rightContentBlock">
          <RightSection
            heading="Add Bank Details"
            description="Welcome to We Move All! Please add your account here."
          />
          <form className="form" onSubmit={handleSubmit}>
            <div className="formFieldsContainer">
              <InputForm
                label="Bank Name"
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                required={false}
              />
              <InputForm
                label="Bank Account Number"
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                required={false}
              />
              <InputForm
                label="Account Holder Name"
                type="text"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleInputChange}
                required={false}
              />
              <UploadFile
                label="Bank Account Details"
                id="bank-details-1"
                onChange={handleFileChange}
                className="customUpload"
                wrapperClassName="uploadWrapperStyle1"
              />

              <div className="formSubmitBtn">
                <LogInBtn data="Continue" type="submit" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBankDetails;
