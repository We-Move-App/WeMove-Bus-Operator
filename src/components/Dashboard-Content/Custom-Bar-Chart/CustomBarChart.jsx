import React, { useState, useEffect } from "react";
import styles from "./custom-bar-chart.module.css";
import { Chart as ChartJs, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import Dropdown from "../../Reusable/Dropdown/Dropdown";

ChartJs.register(...registerables);

const CustomBarChart = () => {
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("dashboardAccessToken");
      if (!token) {
        console.error("Access token not found in localStorage");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        // Monthly API call
        const monthlyRes = await axios.get(
          "http://139.59.20.155:8001/api/v1/wallet/analytics?entity=busoperator&filter=monthly",
          config
        );
        const monthlyAnalytics = monthlyRes.data.data.analytics;

        setMonthlyData(
          monthlyAnalytics.map((item) => ({
            label: item.month,
            value: item.profit,
          }))
        );

        // Yearly API call
        const yearlyRes = await axios.get(
          "http://139.59.20.155:8001/api/v1/wallet/analytics?entity=busoperator&filter=yearly",
          config
        );
        const yearlyAnalytics = yearlyRes.data.data.analytics;

        setYearlyData(
          yearlyAnalytics.map((item) => ({
            label: item.year.toString(),
            value: item.profit,
          }))
        );

        // Weekly API call
        const weeklyRes = await axios.get(
          "http://139.59.20.155:8001/api/v1/wallet/analytics?entity=busoperator&filter=weekly",
          config
        );
        const weeklyAnalytics = weeklyRes.data.data.analytics;

        setWeeklyData(
          weeklyAnalytics.map((item) => ({
            label: item.week,
            value: item.profit,
          }))
        );
      } catch (error) {
        console.error("Error fetching analytics data", error);
      }
    };

    fetchData();
  }, []);

  const generateChartData = (data) => ({
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Incoming",
        data: data.map((d) => d.value),
        backgroundColor: [
          "#FF6F61C2",
          "#96CF20C2",
          "#2A9D8FC2",
          "#459CBFC2",
          "#44C917C2",
          "#E9C46AC2",
          "#F4A261C2",
          "#0598BBC2",
          "#EA5353C2",
          "#1776C3C2",
          "#0FBCC2C2",
          "#D4D450C2",
        ],
        maxBarThickness: 24,
        minBarLength: 2,
      },
    ],
  });

  let chartData = {};
  switch (timePeriod) {
    case "monthly":
      chartData = generateChartData(monthlyData);
      break;
    case "yearly":
      chartData = generateChartData(yearlyData);
      break;
    case "weekly":
      chartData = generateChartData(weeklyData);
      break;
    default:
      chartData = generateChartData(weeklyData);
  }

  return (
    <div className={styles.customBarChartContainer}>
      <div className={styles.header}>
        <Dropdown
          heading="Income Analytics"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          options={[
            { label: "Weekly", value: "weekly" },
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
          ]}
        />
      </div>

      <div className={styles.barGraph}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => (value === 0 ? "0" : value / 1000 + "K"),
                },
                grid: { display: false },
              },
              x: {
                grid: { display: false },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default CustomBarChart;
