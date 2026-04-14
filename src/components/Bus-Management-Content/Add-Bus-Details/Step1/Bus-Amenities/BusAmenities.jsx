import React from "react";
import styles from "./bus-amenities.module.css";
import images from "../../../../../assets/image";
import { useTranslation } from "react-i18next";

const BusAmenities = ({ formData, setFormData }) => {
  const { t } = useTranslation();

  const amenitiesList = [
    { name: "A/C", icon: images.acOn, key: "AC" },
    { name: "Non A/C", icon: images.acOff, key: "NonAC" },
    { name: "Wifi", icon: images.wifi, key: "Wifi" },
    { name: "Pillow", icon: images.pillow, key: "Pillow" },
  ];

  const selectedAmenities = formData.amenities || [];

  const toggleAmenity = (amenity) => {
    let updatedAmenities;

    const isSelected = selectedAmenities.some((a) => a.name === amenity.name);

    if (isSelected) {
      updatedAmenities = selectedAmenities.filter(
        (a) => a.name !== amenity.name,
      );
    } else {
      if (amenity.name === "A/C" || amenity.name === "Non A/C") {
        updatedAmenities = selectedAmenities.filter(
          (a) => a.name !== "A/C" && a.name !== "Non A/C",
        );
      } else {
        updatedAmenities = [...selectedAmenities];
      }

      updatedAmenities.push({ name: amenity.name });
    }

    setFormData({ ...formData, amenities: updatedAmenities });
  };

  return (
    <div className={styles.amenityBlock}>
      <div className={styles.content}>
        <h3>{t("busAmenities.title")}</h3>
      </div>

      <div className={styles.amenitiesContainer}>
        {amenitiesList?.map((amenity) => (
          <button
            key={amenity.name}
            className={`${styles.amenityButton} ${
              selectedAmenities.some((a) => a.name === amenity.name)
                ? styles.selected
                : ""
            }`}
            onClick={() => toggleAmenity(amenity)}
          >
            <img
              src={amenity.icon}
              alt={amenity.name}
              className={styles.amenityIcon}
            />

            <h3>{t(`busAmenities.${amenity.key}`)}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BusAmenities;
