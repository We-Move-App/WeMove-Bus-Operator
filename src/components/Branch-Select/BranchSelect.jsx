import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./branchSelect.module.css";
import axiosInstance from "../../services/axiosInstance";

const BranchSelect = ({
  label,
  required,
  name,
  value,
  onChange,
  onBlur,
  touched,
  error,
}) => {
  const { t } = useTranslation();

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        setFetchError("");

        const res = await axiosInstance.get("/admin/branch/all");

        if (res?.data?.data?.branches) {
          setBranches(res.data.data.branches);
        } else {
          setBranches([]);
        }
      } catch (err) {
        console.error("Error fetching branches:", err);
        setBranches([]);
        setFetchError(t("branchSelect.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [t]);

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        {label || t("branchSelect.label")}{" "}
        {required && <span className={styles.required}>*</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={loading || !!fetchError}
        className={`${styles.select} ${
          touched && error ? styles.errorBorder : ""
        }`}
      >
        <option value="">
          {loading
            ? t("branchSelect.loading")
            : branches.length === 0
              ? t("branchSelect.noBranches")
              : t("branchSelect.selectBranch")}
        </option>

        {branches.map((branch) => (
          <option key={branch._id} value={branch._id}>
            {branch.name}
          </option>
        ))}
      </select>

      {/* Form validation error */}
      {touched && error && <span className={styles.error}>{error}</span>}

      {/* API fetch error */}
      {!loading && fetchError && (
        <span className={styles.error}>{fetchError}</span>
      )}
    </div>
  );
};

export default BranchSelect;
