import React, { useState, useRef } from "react";
import styles from "./drag-drop.module.css";
import images from "../../../assets/image";
import UploadBox from "../UploadBox/UploadBox";
import SnackbarNotification from "../Snackbar-Notification/SnackbarNotification";

// const DragFile = ({ setAvatar }) => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const justDropped = useRef(false);

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);

//     const file = e.dataTransfer.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setAvatar(file);
//       // console.log("Dropped file:", file);
//       justDropped.current = true;
//     } else {
//       alert("Only JPEG or PNG images are allowed.");
//     }
//   };

//   const handleBrowse = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setAvatar(file);
//       // console.log("Browsed file:", file);
//     } else {
//       alert("Only JPEG or PNG images are allowed.");
//     }
//     e.target.value = "";
//   };

//   const handleBrowseClick = (e) => {
//     if (justDropped.current) {
//       e.preventDefault();
//       e.stopPropagation();
//       // delay clearing to avoid opening file picker after drop
//       setTimeout(() => {
//         justDropped.current = false;
//       }, 100);
//       return;
//     }
//     document.getElementById("file-input").click();
//   };

//   const handleUploadClose = () => {
//     setSelectedFile(null);
//   };

//   const isImageFile = (file) => {
//     const validTypes = ["image/jpeg", "image/png"];
//     return validTypes.includes(file.type);
//   };

//   return (
//     <>
//       <div
//         className={`${styles.dragFileContainer} ${
//           isDragging ? styles.dragging : ""
//         }`}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         onMouseDown={handleBrowseClick}
//       >
//         <div className={styles.imageDragBlock}>
//           <img src={images.docIcon} alt="doc-icon" />
//         </div>
//         <div className={styles.contentBlockDrag}>
//           {selectedFile ? (
//             <p>{selectedFile.name}</p>
//           ) : (
//             <p>
//               Drag and drop or <span className="link-url">browse</span> your
//               files
//             </p>
//           )}
//         </div>

//         {/* Hidden file input for browsing */}
//         <input
//           type="file"
//           id="file-input"
//           style={{ display: "none" }}
//           onChange={handleBrowse}
//           accept=".jpeg,.jpg,.png,image/jpeg,image/png"
//         />
//       </div>

//       {selectedFile && (
//         <UploadBox selectedFile={selectedFile} onClose={handleUploadClose} />
//       )}
//     </>
//   );
// };

const DragFile = ({ setAvatar }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const justDropped = useRef(false);

  const MAX_FILE_SIZE_MB = 2;

  const showSnackbar = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: "error",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const isImageFile = (file) => {
    const validTypes = ["image/jpeg", "image/png"];
    return validTypes.includes(file.type);
  };

  const isFileSizeValid = (file) => {
    return file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (!isImageFile(file)) {
        return showSnackbar("Only JPEG or PNG images are allowed.");
      }
      if (!isFileSizeValid(file)) {
        return showSnackbar("File size should be 2MB or less.");
      }

      setSelectedFile(file);
      setAvatar(file);
      justDropped.current = true;
    }
  };

  const handleBrowse = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!isImageFile(file)) {
        showSnackbar("Only JPEG or PNG images are allowed.");
      } else if (!isFileSizeValid(file)) {
        showSnackbar("File size should be 2MB or less.");
      } else {
        setSelectedFile(file);
        setAvatar(file);
      }
    }
    e.target.value = "";
  };

  const handleBrowseClick = (e) => {
    if (justDropped.current) {
      e.preventDefault();
      e.stopPropagation();
      setTimeout(() => {
        justDropped.current = false;
      }, 100);
      return;
    }
    document.getElementById("file-input").click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUploadClose = () => {
    setSelectedFile(null);
  };

  return (
    <>
      <div
        className={`${styles.dragFileContainer} ${
          isDragging ? styles.dragging : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseDown={handleBrowseClick}
      >
        <div className={styles.imageDragBlock}>
          <img src={images.docIcon} alt="doc-icon" />
        </div>
        <div className={styles.contentBlockDrag}>
          {selectedFile ? (
            <p>{selectedFile.name}</p>
          ) : (
            <p>
              Drag and drop or <span className="link-url">browse</span> your
              files
            </p>
          )}
        </div>

        {/* Hidden file input for browsing */}
        <input
          type="file"
          id="file-input"
          style={{ display: "none" }}
          onChange={handleBrowse}
          accept=".jpeg,.jpg,.png,image/jpeg,image/png"
        />
      </div>

      {selectedFile && (
        <UploadBox selectedFile={selectedFile} onClose={handleUploadClose} />
      )}

      {/* Snackbar Notification */}
      <SnackbarNotification
        snackbar={snackbar}
        handleClose={handleCloseSnackbar}
      />
    </>
  );
};

export default DragFile;
