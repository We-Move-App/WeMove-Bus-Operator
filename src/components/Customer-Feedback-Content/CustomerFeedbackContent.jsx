import React, { useState, useEffect } from "react";
import styles from "./customer-feedback-content.module.css";
import ContentHeading from "../Reusable/Content-Heading/ContentHeading";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import images from "../../assets/image";
import Pagination from "../Reusable/Pagination/Pagination";
import axiosInstance from "../../services/axiosInstance";
import { Skeleton, Box } from "@mui/material";

const feedbacksPerPage = 6;

const CustomerFeedbackContent = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratings, setRatings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosInstance.get("/buses/feedback/all/");
        const feedbacks = response.data?.data;

        if (feedbacks && feedbacks.length > 0) {
          setFeedbackList(feedbacks);

          const initialRatings = feedbacks.reduce((acc, feedback) => {
            acc[feedback._id] = feedback.rating || 0;
            return acc;
          }, {});
          setRatings(initialRatings);
        } else {
          setApiMessage(response.data?.message || "No feedback found.");
        }
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setApiMessage(error.response.data.message);
        } else {
          setApiMessage("Something went wrong. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const totalPages = Math.ceil(feedbackList.length / feedbacksPerPage);

  // const handleRatingChange = (id, newValue) => {
  //   setRatings((prev) => ({ ...prev, [id]: newValue }));
  // };

  const indexOfLast = currentPage * feedbacksPerPage;
  const indexOfFirst = indexOfLast - feedbacksPerPage;
  const currentFeedbacks = feedbackList.slice(indexOfFirst, indexOfLast);

  return (
    <div>
      <ContentHeading
        heading="Customer Feedback"
        showSubHeading={true}
        subHeading="Customer Feedback"
      />
      {/* {isLoading ? (
        <p>Loading feedback...</p>
      ) : feedbackList.length === 0 ? (
        <p>{apiMessage}</p>
      ) : (
        <>
          <div className={styles.feedbackContainer}>
            {currentFeedbacks.map((feedback) => (
              <div key={feedback._id} className={styles.feedbackBlock}>
                <div className={styles.feebackHalves}>
                  <div className={styles.feebackleft}>
                    <div className={styles.userImage}>
                      <img
                        src={
                          feedback.userId?.avatar?.url || images.userFeedback
                        } // Or use a default image
                        alt={feedback.userId?.fullName || "User"}
                      />
                    </div>
                    <div className={styles.feebackContent}>
                      <h4>{feedback.userId?.fullName || "Anonymous"}</h4>
                      <span className={styles.date}>
                        <p>
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </p>
                      </span>
                    </div>
                  </div>
                  <div className={styles.feedbackRight}>
                    <Stack spacing={2}>
                      <Rating
                        name={`rating-${feedback._id}`}
                        value={ratings[feedback._id]}
                        precision={0.5}
                        // onChange={(event, newValue) =>
                        //   handleRatingChange(feedback._id, newValue)
                        // }
                        readOnly
                        sx={{ color: "#ffb400" }}
                      />
                    </Stack>
                  </div>
                </div>
                <div className={styles.mainContent}>
                  <p>{feedback.comment}</p>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )} */}

      {isLoading ? (
        <div className={styles.feedbackContainer}>
          {/* Render 3 fake feedback cards as skeletons */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={styles.feedbackBlock}>
              <div className={styles.feebackHalves}>
                {/* Left side: image + name/date */}
                <div className={styles.feebackleft}>
                  <div className={styles.userImage}>
                    <Skeleton variant="circular" width={50} height={50} />
                  </div>
                  <div className={styles.feebackContent}>
                    <Skeleton variant="text" width={120} height={20} />
                    <Skeleton variant="text" width={80} height={15} />
                  </div>
                </div>

                {/* Right side: rating */}
                <div className={styles.feedbackRight}>
                  <Stack spacing={1}>
                    <Skeleton variant="rectangular" width={100} height={24} />
                  </Stack>
                </div>
              </div>

              {/* Feedback comment skeleton */}
              <div className={styles.mainContent}>
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </div>
            </div>
          ))}
        </div>
      ) : feedbackList.length === 0 ? (
        <p>{apiMessage}</p>
      ) : (
        <>
          <div className={styles.feedbackContainer}>
            {currentFeedbacks.map((feedback) => (
              <div key={feedback._id} className={styles.feedbackBlock}>
                <div className={styles.feebackHalves}>
                  <div className={styles.feebackleft}>
                    <div className={styles.userImage}>
                      <img
                        src={
                          feedback.userId?.avatar?.url || images.userFeedback
                        }
                        alt={feedback.userId?.fullName || "User"}
                      />
                    </div>
                    <div className={styles.feebackContent}>
                      <h4>{feedback.userId?.fullName || "Anonymous"}</h4>
                      <span className={styles.date}>
                        <p>
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </p>
                      </span>
                    </div>
                  </div>
                  <div className={styles.feedbackRight}>
                    <Stack spacing={2}>
                      <Rating
                        name={`rating-${feedback._id}`}
                        value={ratings[feedback._id]}
                        precision={0.5}
                        readOnly
                        sx={{ color: "#ffb400" }}
                      />
                    </Stack>
                  </div>
                </div>
                <div className={styles.mainContent}>
                  <p>{feedback.comment}</p>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default CustomerFeedbackContent;
