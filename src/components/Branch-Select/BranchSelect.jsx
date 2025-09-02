import { useEffect, useState } from "react";
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
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/admin/branch/all");
        if (res?.data?.data?.branches) {
          setBranches(res.data.data.branches);
        } else {
          setBranches([]);
        }
      } catch (err) {
        console.error("Error fetching branches:", err);
        setBranches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={(e) => {
          console.log("Selected branch id:", e.target.value);
          onChange(e);
        }}
        onBlur={onBlur}
        disabled={loading}
        className={`${styles.select} ${
          touched && error ? styles.errorBorder : ""
        }`}
      >
        <option value="">
          {loading ? "Loading branches..." : "Select a branch"}
        </option>
        {branches.map((branch) => (
          <option key={branch._id} value={branch._id}>
            {branch.name} ({branch.location})
          </option>
        ))}
      </select>

      {touched && error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default BranchSelect;
