import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import styles from "./custom-pie-chart.module.css";
import BusPie from "../../Reusable/Bus-Number-Pie/BusPie";
import Dropdown from "../../Reusable/Dropdown/Dropdown";
import axiosInstance from "../../../services/axiosInstance";

ChartJs.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const CustomPieChart = () => {
  const [timePeriod, setTimePeriod] = useState("monthly");

  const [busData, setBusData] = useState([]);

  useEffect(() => {
    console.log("busData", busData);
  }, [busData]);

  // useEffect(() => {
  //   const fetchBusAnalytics = async () => {
  //     try {
  //       const response = await axiosInstance.get(
  //         `/bus-operator/analytics/buses?filter=${timePeriod}`
  //       );
  //       if (response?.data?.success) {
  //         setBusData(response.data.data);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch bus analytics:", error);
  //     }
  //   };

  //   fetchBusAnalytics();
  // }, [timePeriod]);

  useEffect(() => {
    const fetchBusAnalytics = async () => {
      try {
        console.log(
          "[CustomPieChart] fetching bus analytics, filter=",
          timePeriod
        );
        const response = await axiosInstance.get(
          `/bus-operator/analytics/buses?filter=${timePeriod}`
        );

        console.log("[CustomPieChart] raw response:", response);

        // Helpful normalization: some APIs wrap in data.data, some in data.payload
        const success = response?.data?.success ?? null;
        const payload = response?.data?.data ?? response?.data?.payload ?? null;

        console.log("[CustomPieChart] success:", success);
        console.log("[CustomPieChart] payload (data):", payload);

        if (success === false) {
          console.warn(
            "[CustomPieChart] API reported success:false",
            response.data
          );
          setBusData([]); // keep empty but log
          return;
        }

        if (!payload || !Array.isArray(payload) || payload.length === 0) {
          console.warn("[CustomPieChart] payload is empty or not an array");
          setBusData([]); // empty
          return;
        }

        // ensure bookingPercentage is numeric
        const normalized = payload.map((b) => ({
          ...b,
          bookingPercentage: Number(b.bookingPercentage) || 0,
        }));

        console.log("[CustomPieChart] normalized payload:", normalized);

        setBusData(normalized);
      } catch (error) {
        console.error("[CustomPieChart] Failed to fetch bus analytics:", error);
        // show network-level error details
        if (error?.response) {
          console.error(
            "status",
            error.response.status,
            "data",
            error.response.data
          );
        }
        setBusData([]); // keep empty
      }
    };

    fetchBusAnalytics();
  }, [timePeriod]);

  // Fixed Pie Chart Data (Max: 80%, Min: 20%)
  // const pieData = {
  //   labels: ["Maximum Percentage: 80%", "Minimum Percentage: 20%"],
  //   datasets: [
  //     {
  //       data: [80, 20],
  //       backgroundColor: ["#2D6A4F", "#FFB85A"],
  //       hoverBackgroundColor: ["#2D6A4F", "#FFB85A"],
  //     },
  //   ],
  // };

  const pieData = {
    labels: busData.map(
      (bus) => `${bus.busRegNumber} (${bus.bookingPercentage}%)`
    ),
    datasets: [
      {
        data: busData.map((bus) => bus.bookingPercentage),
        backgroundColor: [
          "#2D6A4F",
          "#FFB85A",
          "#6C63FF",
          "#FF6B6B",
          "#FFD93D",
          "#1E88E5",
        ],
        hoverBackgroundColor: [
          "#2D6A4F",
          "#FFB85A",
          "#6C63FF",
          "#FF6B6B",
          "#FFD93D",
          "#1E88E5",
        ],
      },
    ],
  };

  // const options = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: "right",
  //       labels: {
  //         boxWidth: 30,
  //         padding: 10,
  //         borderRadius: 50,
  //       },
  //     },
  //     datalabels: {
  //       display: true,
  //       color: "#fff",
  //       font: {
  //         weight: "normal",
  //         size: 20,
  //       },
  //       formatter: (value) => `${value}%`,
  //     },
  //   },
  // };

  const options = {
    plugins: {
      datalabels: {
        display: true,
        color: "#fff",
        font: {
          size: 14,
        },
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return `${value}%`;
        },
      },
    },
  };

  return (
    <div className={styles.customPieContainer}>
      <div className={styles.header}>
        <Dropdown
          heading="Bus Usage"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Weekly", value: "weekly" },
            { label: "Yearly", value: "yearly" },
          ]}
        />
      </div>

      {/* Pie Chart */}
      <div className={styles.chartWrapper}>
        {busData.length > 0 ? (
          <Pie data={pieData} options={options} />
        ) : (
          <div className={styles.noDataMsg}>
            No bus analytics available for this period.
          </div>
        )}
      </div>

      <div className={styles.flexPieBox}>
        {busData.map((bus) => (
          <BusPie
            key={bus.busId}
            busNumber={bus.busRegNumber}
            progress={bus.bookingPercentage}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomPieChart;
