import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateFormData } from "../../../../../redux/slices/busSlice";
import styles from "./bus-info.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const BusInfo = ({ data, setData }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (data.busImages) {
      const imageArray = Array.isArray(data.busImages)
        ? data.busImages
        : [data.busImages];

      const previews = imageArray.map((file) =>
        file instanceof File ? URL.createObjectURL(file) : file,
      );
      setPreviewImages(previews);
    } else {
      setPreviewImages([]);
    }
  }, [data.busImages]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    if ((data.busImages?.length || 0) + files.length > 5) {
      alert(t("busInfoForm.uploadLimit")); // ✅ translated
      return;
    }

    const previewURLs = files.map((file) => URL.createObjectURL(file));

    const updatedBusImages = [...(data.busImages || []), ...previewURLs];

    setData((prevData) => ({
      ...prevData,
      busImages: updatedBusImages,
    }));
  };

  return (
    <div className={styles.busInfoContainer}>
      <div className={styles.addBusDetailContainer}>
        {previewImages.map((src, index) => (
          <div key={index} className={styles.imageBlock}>
            <img src={src} alt={`bus-icon-${index}`} />
          </div>
        ))}

        {data.busImages?.length < 5 && (
          <div className={styles.iconBlock}>
            <label htmlFor="file-upload">
              <AiOutlinePlus color="#008533" size={30} />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              hidden
            />
          </div>
        )}
      </div>

      {/* Input Fields */}
      <div className={styles.busInfoFields}>
        <div className={styles.busFields}>
          <label>{t("busInfoForm.companyName")}</label>
          <input
            type="text"
            name="busName"
            value={localStorage.getItem("companyName") || ""}
            readOnly
          />
        </div>

        <div className={styles.busFields}>
          <label>{t("busInfoForm.busName")}</label>
          <input
            type="text"
            name="busName"
            value={data.busName || ""}
            onChange={(e) => setData({ ...data, busName: e.target.value })}
          />
        </div>

        <div className={styles.busFields}>
          <label>{t("busInfoForm.busModelNumber")}</label>
          <input
            type="text"
            name="busModelNumber"
            value={data.busModelNumber || ""}
            onChange={(e) =>
              setData({ ...data, busModelNumber: e.target.value })
            }
          />
        </div>

        <div className={styles.busFields}>
          <label>{t("busInfoForm.busRegistrationNumber")}</label>
          <input
            type="text"
            name="busRegNumber"
            value={data.busRegNumber || ""}
            onChange={(e) => setData({ ...data, busRegNumber: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default BusInfo;
