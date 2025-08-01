import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./dropdown-menu.module.css";

const DropdownMenu = ({ options, Icon, buttonLabel = "View List" }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyles, setMenuStyles] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const estimatedWidth = 100;

      const menuWidth = Math.max(estimatedWidth, buttonRef.current.offsetWidth);

      const maxLeft = window.innerWidth - menuWidth - 10;
      const adjustedLeft = Math.min(rect.left, maxLeft);

      setMenuStyles({
        position: "absolute",
        top: `${rect.bottom + window.scrollY}px`,
        left: `${adjustedLeft + window.scrollX}px`,
        zIndex: 1000,
        // width: estimatedWidth,
        // maxWidth: "200px",
      });
    }
  }, [open]);

  return (
    <>
      <span ref={buttonRef}>
        {Icon ? (
          <Icon
            className={styles.icon}
            onClick={() => setOpen((prev) => !prev)}
          />
        ) : (
          <button
            className={styles.viewButton}
            onClick={() => setOpen((prev) => !prev)}
          >
            {buttonLabel}
          </button>
        )}
      </span>

      {open &&
        ReactDOM.createPortal(
          <div ref={menuRef} style={menuStyles} className={styles.dropdownMenu}>
            {options.length > 0 ? (
              options.map((option, index) => (
                <React.Fragment key={index}>
                  <button
                    className={styles.menuItem}
                    onClick={() => {
                      setOpen(false);
                      option.onClick();
                    }}
                  >
                    {option.label}
                  </button>
                  {index !== options.length - 1 && (
                    <div className={styles.divider}></div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className={styles.noData}>No Data Available</div>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default DropdownMenu;
