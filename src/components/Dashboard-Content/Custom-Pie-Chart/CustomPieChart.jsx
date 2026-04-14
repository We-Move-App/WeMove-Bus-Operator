import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import styles from "./custom-pie-chart.module.css";
import BusPie from "../../Reusable/Bus-Number-Pie/BusPie";
import Dropdown from "../../Reusable/Dropdown/Dropdown";
import axiosInstance from "../../../services/axiosInstance";
import { useTranslation } from "react-i18next";

ChartJs.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const CustomPieChart = () => {
  const { t, i18n } = useTranslation();

  const [timePeriod, setTimePeriod] = useState("monthly");
  const [busData, setBusData] = useState([]);

  useEffect(() => {
    const fetchBusAnalytics = async () => {
      try {
        const response = await axiosInstance.get(
          `/bus-operator/analytics/buses?filter=${timePeriod}`,
        );

        const success = response?.data?.success ?? null;
        const payload = response?.data?.data ?? response?.data?.payload ?? null;

        if (success === false) {
          setBusData([]);
          return;
        }

        if (!payload || !Array.isArray(payload) || payload.length === 0) {
          setBusData([]);
          return;
        }

        const normalized = payload.map((b) => ({
          ...b,
          bookingPercentage: Number(b.bookingPercentage) || 0,
        }));

        setBusData(normalized);
      } catch (error) {
        console.error("Failed to fetch bus analytics:", error);
        setBusData([]);
      }
    };

    fetchBusAnalytics();
  }, [timePeriod]);

  const pieData = {
    labels: busData.map(
      (bus) => `${bus.busRegNumber} (${bus.bookingPercentage}%)`,
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

  const options = {
    plugins: {
      datalabels: {
        display: true,
        color: "#fff",
        font: {
          size: 14,
        },
        formatter: (value) => `${value}%`,
      },
    },
  };

  return (
    <div className={styles.customPieContainer}>
      <div className={styles.header}>
        <Dropdown
          heading={t("dashboard.pieChart.heading")}
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          options={[
            {
              label: t("dashboard.pieChart.monthly"),
              value: "monthly",
            },
            {
              label: t("dashboard.pieChart.weekly"),
              value: "weekly",
            },
            {
              label: t("dashboard.pieChart.yearly"),
              value: "yearly",
            },
          ]}
        />
      </div>

      {/* Pie Chart */}
      <div className={styles.chartWrapper}>
        {busData.length > 0 ? (
          <Pie
            key={i18n.language + timePeriod}
            data={pieData}
            options={options}
          />
        ) : (
          <div className={styles.noDataMsg}>
            {t("dashboard.pieChart.noData")}
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
