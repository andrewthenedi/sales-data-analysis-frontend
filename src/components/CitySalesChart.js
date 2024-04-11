import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./CitySalesChart.css";

Chart.register(
  ...registerables,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CitySalesChart({ chartData, onDownload }) {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    // Handle chart instance cleanup
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartData.map((d) => d.city_name),
        datasets: [
          {
            label: "Total Sales",
            data: chartData.map((d) => d.total_sales),
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
              text: "Sales Amount",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Sales Performance Across Cities",
          },
          legend: {
            display: false, // Single dataset, legend not needed
          },
        },
      },
    });

    // Cleanup on unmount (optional)
    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [chartData]);

  return (
    <div className="city-sales-chart-container">
      <canvas ref={canvasRef} />
      <button onClick={onDownload} className="download-button">
        Download City Data
      </button>
    </div>
  );
}

export default CitySalesChart;
