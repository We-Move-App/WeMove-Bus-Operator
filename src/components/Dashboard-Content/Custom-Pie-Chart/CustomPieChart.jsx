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
    const fetchBusAnalytics = async () => {
      try {
        const response = await axiosInstance.get(
          `/bus-operator/analytics/buses?filter=${timePeriod}`
        );
        if (response?.data?.success) {
          setBusData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch bus analytics:", error);
      }
    };

    fetchBusAnalytics();
  }, [timePeriod]);

  // Fixed Pie Chart Data (Max: 80%, Min: 20%)
  const pieData = {
    labels: ["Maximum Percentage: 80%", "Minimum Percentage: 20%"],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ["#2D6A4F", "#FFB85A"],
        hoverBackgroundColor: ["#2D6A4F", "#FFB85A"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          boxWidth: 30,
          padding: 10,
          borderRadius: 50,
        },
      },
      datalabels: {
        display: true,
        color: "#fff",
        font: {
          weight: "normal",
          size: 20,
        },
        formatter: (value) => `${value}%`,
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
          ]}
        />
      </div>

      {/* Pie Chart */}
      <div className={styles.chartWrapper}>
        <Pie data={pieData} options={options} />
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
