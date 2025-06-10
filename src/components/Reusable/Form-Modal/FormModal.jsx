import React, { useEffect } from "react";
import styles from "./form-modal.module.css";
import { IoClose } from "react-icons/io5";

const FormModal = ({
  content,
  isOpen,
  onClose,
  showClose = true,
  actionButton,
  customClassName = "",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {showClose && (
          <div className={styles.modalHeader}>
            <button className={styles.closeBtn} onClick={onClose}>
              <IoClose />
            </button>
          </div>
        )}

        <div className={`${styles.content} ${customClassName}`}>
          {content}
          {actionButton && (
            <div className={styles.actionBtnContainer}>{actionButton}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormModal;
