import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Phone, User } from "lucide-react";
import styles from "./driverList.module.css";

const DriverList = ({
  contacts = [],
  placeholder = "Select a contact",
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (contact) => {
    setSelectedContact(contact);
    setIsOpen(false);
    onSelect && onSelect(contact);
  };

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.button} ${isOpen ? styles.active : ""}`}
      >
        <div className={styles.buttonContent}>
          {selectedContact ? (
            <>
              <div className={styles.iconBox}>
                <User size={16} className={styles.userIcon} />
              </div>
              <div>
                <div className={styles.name}>{selectedContact.name}</div>
                <div className={styles.mobile}>
                  <Phone size={12} className={styles.phoneIcon} />
                  {selectedContact.mobile}
                </div>
              </div>
            </>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`${styles.chevron} ${isOpen ? styles.rotate : ""}`}
          size={16}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {contacts.length === 0 ? (
            <div className={styles.noContact}>No contacts available</div>
          ) : (
            contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelect(contact)}
                className={styles.option}
              >
                <div className={styles.optionContent}>
                  <div className={styles.iconBox}>
                    <User size={16} className={styles.userIcon} />
                  </div>
                  <div>
                    <div className={styles.name}>{contact.name}</div>
                    <div className={styles.mobile}>
                      <Phone size={12} className={styles.phoneIcon} />
                      {contact.mobile}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DriverList;
