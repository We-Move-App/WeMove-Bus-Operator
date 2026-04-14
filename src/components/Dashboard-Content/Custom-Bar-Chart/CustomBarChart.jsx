import React, { useState, useEffect } from "react";
import styles from "./custom-bar-chart.module.css";
import { Chart as ChartJs, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import axiosInstance from "../../../services/axiosInstance";
import Dropdown from "../../Reusable/Dropdown/Dropdown";
import { useTranslation } from "react-i18next";

ChartJs.register(...registerables);

const CustomBarChart = () => {
  const { t, i18n } = useTranslation();

  const [timePeriod, setTimePeriod] = useState("weekly");
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  const formatLabel = (type, value) => {
    if (type === "month") {
      return t(`dashboard.months.${value}`, value);
    }
    if (type === "week") {
      return t(`dashboard.weeks.${value}`, value);
    }
    return value;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const monthlyRes = await axiosInstance.get(
          "/wallet/analytics?entity=busoperator&filter=monthly",
        );

        setMonthlyData(
          monthlyRes.data.data.analytics.map((item) => ({
            label: item.month,
            value: item.profit,
          })),
        );

        const yearlyRes = await axiosInstance.get(
          "/wallet/analytics?entity=busoperator&filter=yearly",
        );

        setYearlyData(
          yearlyRes.data.data.analytics.map((item) => ({
            label: item.year.toString(),
            value: item.profit,
          })),
        );

        const weeklyRes = await axiosInstance.get(
          "/wallet/analytics?entity=busoperator&filter=weekly",
        );

        setWeeklyData(
          weeklyRes.data.data.analytics.map((item) => ({
            label: item.week,
            value: item.profit,
          })),
        );
      } catch (error) {
        console.error("Error fetching analytics data", error);
      }
    };

    fetchData();
  }, []);

  const generateChartData = (data, type) => ({
    labels: data.map((d) => formatLabel(type, d.label)),
    datasets: [
      {
        label: t("dashboard.barChart.incoming"),
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
      chartData = generateChartData(monthlyData, "month");
      break;
    case "yearly":
      chartData = generateChartData(yearlyData);
      break;
    case "weekly":
    default:
      chartData = generateChartData(weeklyData, "week");
  }

  return (
    <div className={styles.customBarChartContainer}>
      <div className={styles.header}>
        <Dropdown
          heading={t("dashboard.barChart.heading")}
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          options={[
            {
              label: t("dashboard.barChart.weekly"),
              value: "weekly",
            },
            {
              label: t("dashboard.barChart.monthly"),
              value: "monthly",
            },
            {
              label: t("dashboard.barChart.yearly"),
              value: "yearly",
            },
          ]}
        />
      </div>

      <div className={styles.barGraph}>
        <Bar
          key={i18n.language}
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
                  callback: (value) =>
                    new Intl.NumberFormat(i18n.language, {
                      notation: "compact",
                    }).format(value),
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
