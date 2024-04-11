import axios from "axios";

const API_URL = "http://127.0.0.1:5000/sales"; // Replace with your actual backend URL

export const fetchCitySalesData = async ({
  // Dedicated function for city data
  startDate,
  endDate,
  startTime,
  endTime,
  selectedCities = [],
  qtyThreshold,
}) => {
  const params = {
    start_date: startDate,
    end_date: endDate,
    start_time: startTime,
    end_time: endTime,
    city_names:
      selectedCities.length > 0 ? selectedCities.join(",") : undefined,
    qty_threshold: qtyThreshold,
  };

  Object.keys(params).forEach(
    (key) => params[key] === undefined && delete params[key]
  );

  try {
    const response = await axios.get(`${API_URL}/time_series/cities`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching city sales data:", error);
    throw new Error("Could not fetch city sales data.");
  }
};

export const fetchDistrictSalesData = async ({
  // Dedicated function for district data
  startDate,
  endDate,
  startTime,
  endTime,
  selectedCities = [], // (Potentially unused, depends on backend implementation)
  qtyThreshold,
}) => {
  const params = {
    start_date: startDate,
    end_date: endDate,
    start_time: startTime,
    end_time: endTime,
    city_names:
      selectedCities.length > 0 ? selectedCities.join(",") : undefined,
    qty_threshold: qtyThreshold,
  };

  Object.keys(params).forEach(
    (key) => params[key] === undefined && delete params[key]
  );

  try {
    const response = await axios.get(`${API_URL}/time_series/districts`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching district sales data:", error);
    throw new Error("Could not fetch district sales data.");
  }
};

export const downloadSalesData = async (filters) => {
  try {
    // Create a params object with adjusted key names
    const params = {
      start_date: filters.startDate,
      end_date: filters.endDate,
      start_time: filters.startTime,
      end_time: filters.endTime,
      city_names: filters.selectedCities.join(","), // Assuming this is correct for the backend
      qty_threshold: filters.qtyThreshold, // If your backend uses 'qty_threshold'
    };

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    const response = await axios.get(`${API_URL}/download`, {
      params,
      responseType: "blob",
    });

    // Create a downloadable link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sales_data.xlsx"); // Set filename
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link); // Cleanup
  } catch (error) {
    console.error("Download error:", error);
    alert("Failed to download file. Please try again.");
  }
};

export const uploadSalesData = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading sales data:", error);
    throw new Error(error.response?.data?.error || "Error during data upload.");
  }
};
