import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateFormData } from "../../../../../redux/slices/busSlice";
import styles from "./bus-info.module.css";
import { AiOutlinePlus } from "react-icons/ai";

const BusInfo = ({ data, setData }) => {
  const dispatch = useDispatch();
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    // Generate preview URLs when busImages is updated
    if (data.busImages) {
      const previews = data.busImages.map((file) =>
        file instanceof File ? URL.createObjectURL(file) : file
      );
      setPreviewImages(previews);
    }
  }, [data.busImages]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    if ((data.busImages?.length || 0) + files.length > 5) {
      alert("You can upload up to 5 images only!");
      return;
    }

    // Create preview URLs
    const previewURLs = files.map((file) => URL.createObjectURL(file));

    // Combine old and new images
    const updatedBusImages = [...(data.busImages || []), ...previewURLs];

    // Update Redux or local state
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
          <label>Bus Name</label>
          <input
            type="text"
            name="busName"
            value={data.busName || ""}
            onChange={(e) => setData({ ...data, busName: e.target.value })}
          />
        </div>
        <div className={styles.busFields}>
          <label>Bus Model Number</label>
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
          <label>Bus Registration Number</label>
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
