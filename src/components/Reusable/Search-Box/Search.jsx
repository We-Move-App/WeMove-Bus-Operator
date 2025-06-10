import React from "react";
import styles from "./search-box.module.css";
import images from "../../../assets/image";

const Search = ({ className }) => {
  return (
    <>
      {/* Search Bar */}
      <div className={`${styles.searchFilterContainer} ${className}`}>
        <div className={styles.inputWrapper}>
          <input
            type="search"
            placeholder="Search"
            className={styles.searchInput}
          />
          <div className={styles.searchIcon}>
            <span className={styles.line}></span>
            <img src={images.searchIcon} alt="search-icon" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
