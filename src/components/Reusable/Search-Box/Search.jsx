import React, { useState } from "react";
import styles from "./search-box.module.css";
import images from "../../../assets/image";

const Search = ({
  className,
  onSearch,
  paramKey = "search",
  placeholder = "Search",
}) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch({ [paramKey]: value });
    }
  };

  return (
    <div className={`${styles.searchFilterContainer} ${className}`}>
      <div className={styles.inputWrapper}>
        <input
          type="search"
          placeholder={placeholder} // ✅ use prop here
          value={query}
          onChange={handleChange}
          className={styles.searchInput}
        />
        <div className={styles.searchIcon}>
          <span className={styles.line}></span>
          <img src={images.searchIcon} alt="search-icon" />
        </div>
      </div>
    </div>
  );
};

export default Search;
