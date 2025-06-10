import React from "react";
import styles from "./bus-amenities.module.css";
import images from "../../../../../assets/image";

const BusAmenities = ({ formData, setFormData }) => {
  // List of amenities with icons (do not store the icon in the backend)
  const amenitiesList = [
    { name: "A/C", icon: images.acOn },
    { name: "Non A/C", icon: images.acOff },
    { name: "Wifi", icon: images.wifi },
    { name: "Pillow", icon: images.pillow },
  ];

  const selectedAmenities = formData.amenities || [];

  // const toggleAmenity = (amenity) => {
  //   const existing = selectedAmenities.find((a) => a.name === amenity.name);

  //   const updatedAmenities = existing
  //     ? selectedAmenities.filter((a) => a.name !== amenity.name)
  //     : [...selectedAmenities, { name: amenity.name }];

  //   // console.log("Updated Amenities:", updatedAmenities);

  //   setFormData({ ...formData, amenities: updatedAmenities });
  // };

  const toggleAmenity = (amenity) => {
    let updatedAmenities;

    const isSelected = selectedAmenities.some((a) => a.name === amenity.name);

    if (isSelected) {
      // If already selected, remove it
      updatedAmenities = selectedAmenities.filter(
        (a) => a.name !== amenity.name
      );
    } else {
      // If selecting A/C or Non A/C, remove the other if exists
      if (amenity.name === "A/C" || amenity.name === "Non A/C") {
        updatedAmenities = selectedAmenities.filter(
          (a) => a.name !== "A/C" && a.name !== "Non A/C"
        );
      } else {
        updatedAmenities = [...selectedAmenities];
      }

      // Add the selected amenity
      updatedAmenities.push({ name: amenity.name });
    }

    setFormData({ ...formData, amenities: updatedAmenities });
  };

  // Mapping selected amenities to their icons
  const selectedAmenitiesWithIcons = selectedAmenities.map((selected) => {
    const amenity = amenitiesList.find((a) => a.name === selected.name);
    return { ...selected, icon: amenity?.icon };
  });

  return (
    <div className={styles.amenityBlock}>
      <div className={styles.content}>
        <h3>Amenities</h3>
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
            <h3>{amenity?.name}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BusAmenities;
