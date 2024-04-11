import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import "./DistrictSalesChart.css";

function DistrictSalesChart({ chartData, onDownload }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");

    // Destroy the previously created chart to avoid overlay issues
    if (window.districtChartInstance) {
      window.districtChartInstance.destroy();
    }

    // Creating the chart
    window.districtChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartData.map((data) => data.district_name), // Ensure district names are used as labels
        datasets: [
          {
            label: "Total Sales",
            data: chartData.map((data) => data.total_sales), // Matching sales data
            backgroundColor: "rgba(75, 192, 192, 0.8)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Total Sales",
            },
          },
          x: {
            // Adjusting ticks for better visibility
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 45,
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Adjust based on need
          },
          title: {
            display: true,
            text: "District Sales Performance",
          },
        },
        responsive: true,
      },
    });

    return () => {
      if (window.districtChartInstance) {
        window.districtChartInstance.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="district-sales-chart-container">
      <canvas ref={canvasRef} />
      <button onClick={onDownload} className="download-button">
        Download District Data
      </button>
    </div>
  );
}

export default DistrictSalesChart;
