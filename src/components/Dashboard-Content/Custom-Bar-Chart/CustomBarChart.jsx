import React, { useState } from "react";
import styles from "./custom-bar-chart.module.css";
import { Chart as ChartJs, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import sourceData from "../../../assets/data/sourceData.json"; // Monthly data
import weeklyData from "../../../assets/data/weeklyData.json"; // Weekly data
import Dropdown from "../../Reusable/Dropdown/Dropdown";

// Register chart.js components
ChartJs.register(...registerables);

const CustomBarChart = () => {
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(
    Object.keys(weeklyData)[0]
  );

  // Monthly Data Preparation
  const getDataForMonthly = () => {
    return {
      labels: sourceData.map((data) => data.label),
      datasets: [
        {
          label: "Income",
          data: sourceData.map((data) => parseInt(data.value)),
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
    };
  };

  // Weekly Data Preparation (for Selected Month)
  const getDataForWeekly = () => {
    const monthData = weeklyData[selectedMonth];

    if (!monthData) return { labels: [], datasets: [] };

    return {
      labels: Object.keys(monthData).map(
        (week) => `${selectedMonth} - ${week}`
      ),
      datasets: [
        {
          label: "Income",
          data: Object.values(monthData).map((weekData) => weekData.value),
          backgroundColor: [
            "#FF6F61C2",
            "#96CF20C2",
            "#2A9D8FC2",
            "#459CBFC2",
            "#44C917C2",
            "#E9C46AC2",
            "#F4A261C2",
            "#0598BBC2",
          ],
          maxBarThickness: 24,
          minBarLength: 2,
        },
      ],
    };
  };

  return (
    <div className={styles.customBarChartContainer}>
      <div className={styles.header}>
        {/* Dropdown for selecting Monthly or Weekly */}
        <Dropdown
          heading="Income Analytics"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Weekly", value: "weekly" },
          ]}
        />

        {/* Dropdown for selecting a month (only appears when Weekly is selected) */}
        {timePeriod === "weekly" && (
          <Dropdown
            heading=""
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            options={Object.keys(weeklyData).map((month) => ({
              label: month,
              value: month,
            }))}
          />
        )}
      </div>

      {/* Bar Chart */}
      <div className={styles.barGraph}>
        <Bar
          data={
            timePeriod === "monthly" ? getDataForMonthly() : getDataForWeekly()
          }
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              datalabels: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                min: 0,
                max: 120000,
                ticks: {
                  stepSize: 20000,
                  callback: (value) => (value === 0 ? "0" : value / 1000 + "K"),
                },
                grid: { display: false },
                border: {
                  display: false,
                  dash: [4, 4],
                },
              },
              x: {
                grid: { display: false },
                border: {
                  display: false,
                  dash: [4, 4],
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default CustomBarChart;
