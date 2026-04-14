import React, { useState } from "react";
import { Stepper, Step, StepLabel } from "@mui/material";
import styled from "@emotion/styled";
import LogInLeft from "../LogInLeft";
import InputForm from "./InputForm";
import RightSection from "../RightSection";
import LogInBtn from "../../Button/LogInBtn";
import UploadFile from "../UploadFile/UploadFile";
import DragFile from "../DragFile/DragFile";
import SnackbarNotification from "../Snackbar-Notification/SnackbarNotification";
import useMultiStepForm from "../../../hooks/useMultiStepForm";
import { useTranslation } from "react-i18next";

const steps = ["", "", ""];

const StyledStepperContainer = styled("div")({
  width: "50%",
});

const StyledStepper = styled(Stepper)`
  .MuiStepIcon-root {
    font-size: 2rem;
  }
  .MuiStepIcon-root.Mui-active,
  .MuiStepIcon-root.Mui-completed {
    color: #2d6a4f;
  }
  .MuiStepConnector-line {
    display: block;
    border-color: #2d6a4f;
  }
`;

function MultiStepForm() {
  const {
    activeStep,
    formData,
    avatar,
    setAvatar,
    handleChange,
    handleFileUpload,
    handleContinue,
    handleSkipStep,
    handleNext,
    snackbar,
    handleSnackbarClose,
  } = useMultiStepForm();

  const { t } = useTranslation();

  return (
    <div className="logInSection">
      <LogInLeft />
      <div className="rightSectionContainer">
        <div className="rightContentBlock">
          <StyledStepperContainer>
            <StyledStepper activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </StyledStepper>
          </StyledStepperContainer>
          <div className="formFieldsContainer">
            {activeStep === 0 && (
              <>
                <RightSection
                  heading={t("profile.heading")}
                  description={t("profile.description")}
                />
                <InputForm
                  label={t("profile.identityCard")}
                  required={false}
                  type="tel"
                  name="identityCardNumber"
                  value={formData.identityCardNumber}
                  onChange={handleChange}
                />
                <div className="twoColumnInputContainer">
                  <InputForm
                    label={t("profile.businessLicense")}
                    required={false}
                    type="tel"
                    name="businessLicenseNumber"
                    value={formData.businessLicenseNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="threeColumnInputContainer">
                  <UploadFile
                    label={t("profile.idFront")}
                    id="file-input-2"
                    required
                    onChange={(e) =>
                      handleFileUpload(e, "national_identity_card_front")
                    }
                  />
                  <UploadFile
                    label={t("profile.idBack")}
                    id="file-input-3"
                    required
                    onChange={(e) =>
                      handleFileUpload(e, "national_identity_card_back")
                    }
                  />
                </div>
              </>
            )}

            {activeStep === 1 && (
              <>
                <RightSection
                  heading={t("profile.heading")}
                  description={t("profile.description")}
                />
                <InputForm
                  label={t("profile.bankName")}
                  required={false}
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                />

                <InputForm
                  label={t("profile.accountNumber")}
                  required={false}
                  type="tel"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                />
                <InputForm
                  label={t("profile.accountHolder")}
                  required={false}
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                />

                <div className="threeColumnInputContainer">
                  <UploadFile
                    label={t("profile.bankDetails")}
                    id="file-input-1"
                    required
                    onChange={(e) => handleFileUpload(e, "bank_detail")}
                  />
                </div>
              </>
            )}
            {activeStep === 2 && (
              <>
                <RightSection
                  heading={t("profile.uploadPhoto")}
                  description={t("profile.uploadPhotoDesc")}
                  required={true}
                />
                <div className="DropContainer">
                  <DragFile setAvatar={setAvatar} />
                </div>
              </>
            )}
          </div>
          <div className="formSubmitBtn">
            {activeStep === 1 ? (
              <div style={{ display: "flex", gap: "1rem" }}>
                {" "}
                <LogInBtn data={t("common.skip")} onClick={handleSkipStep} />{" "}
                <LogInBtn data={t("common.continue")} onClick={handleContinue} />
              </div>
            ) : (
              <LogInBtn data={t("common.continue")} onClick={handleNext} />
            )}
          </div>
        </div>
      </div>
      <SnackbarNotification
        snackbar={snackbar}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
}

export default MultiStepForm;
