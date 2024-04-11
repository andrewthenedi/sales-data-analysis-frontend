import React, { useState, useEffect, useCallback } from "react";
import FilterForm from "./components/FilterForm";
import CitySalesChart from "./components/CitySalesChart";
import DistrictSalesChart from "./components/DistrictSalesChart";
import UploadModal from "./components/UploadModal";
import {
  fetchCitySalesData,
  fetchDistrictSalesData,
  uploadSalesData,
  downloadSalesData,
} from "./services/apiService";
import "./App.css";

function App() {
  const cityOptions = [
    "七台河",
    "云浮",
    "十堰",
    "唐山",
    "安阳",
    "庆阳",
    "文昌",
    "柳州",
    "济宁",
    "澄迈县",
    "福州",
    "西双版纳傣族自治州",
    "鄂尔多斯",
    "阿拉善盟",
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "2024-04-10",
    endDate: "2024-04-10",
    startTime: "05:00:00",
    endTime: "12:00:00",
    selectedCities: [],
    qtyThreshold: "",
  });

  const handleDownloadCityData = async () => {
    // Make this async
    try {
      await downloadSalesData(filters); // Use the new download function
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  const handleDownloadDistrictData = async () => {
    // Make this async too
    try {
      await downloadSalesData(filters);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  // City chart data and pagination states
  const [cityChartData, setCityChartData] = useState([]);
  const [currentCityPage, setCurrentCityPage] = useState(0);
  const [maxCityPage, setMaxCityPage] = useState(0);
  const [shouldFetchCityData, setShouldFetchCityData] = useState(true);

  // District chart data and pagination states
  const [districtChartData, setDistrictChartData] = useState([]);
  const [currentDistrictPage, setCurrentDistrictPage] = useState(0);
  const [maxDistrictPage, setMaxDistrictPage] = useState(0);
  const [shouldFetchDistrictData, setShouldFetchDistrictData] = useState(true);

  const itemsPerPage = 10;

  // Fetch city sales data
  useEffect(() => {
    if (shouldFetchCityData) {
      setIsLoading(true);
      const fetchCityData = async () => {
        try {
          const data = await fetchCitySalesData({
            ...filters,
            page: currentCityPage,
            itemsPerPage,
          });
          setCityChartData(data);
          setMaxCityPage(Math.ceil(data.length / itemsPerPage) - 1);
          setShouldFetchCityData(false);
        } catch (error) {
          console.error("Error fetching city sales data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCityData();
    }
  }, [currentCityPage, shouldFetchCityData, filters]);

  // Fetch district sales data
  useEffect(() => {
    if (shouldFetchDistrictData) {
      setIsLoading(true);
      const fetchDistrictData = async () => {
        try {
          const data = await fetchDistrictSalesData({
            ...filters,
            page: currentDistrictPage,
            itemsPerPage,
          });
          setDistrictChartData(data);
          setMaxDistrictPage(Math.ceil(data.length / itemsPerPage) - 1);
          setShouldFetchDistrictData(false);
        } catch (error) {
          console.error("Error fetching district sales data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDistrictData();
    }
  }, [currentDistrictPage, shouldFetchDistrictData, filters]);

  const handleFilterSubmit = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentCityPage(0);
    setCurrentDistrictPage(0);
    setShouldFetchCityData(true);
    setShouldFetchDistrictData(true);
  }, []);

  const handleFileUpload = useCallback(async (file) => {
    setIsLoading(true);
    try {
      await uploadSalesData(file);
      setShouldFetchCityData(true);
      setShouldFetchDistrictData(true);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="App">
      <h1>Sales Data Analysis Dashboard</h1>
      {isLoading && <p>Loading...</p>}
      <FilterForm
        onFilterSubmit={handleFilterSubmit}
        selectedCities={filters.selectedCities}
        cityOptions={cityOptions}
      />
      <CitySalesChart
        chartData={cityChartData.slice(
          currentCityPage * itemsPerPage,
          (currentCityPage + 1) * itemsPerPage
        )}
        onDownload={handleDownloadCityData}
      />
      {/* Pagination for City Sales Chart */}
      <div className="pagination">
        <button
          onClick={() => {
            setCurrentCityPage((prev) => Math.max(prev - 1, 0));
            setShouldFetchCityData(true);
          }}
          disabled={currentCityPage <= 0}
        >
          Previous City Page
        </button>
        <span>
          City Page {currentCityPage + 1} of {maxCityPage + 1}
        </span>
        <button
          onClick={() => {
            setCurrentCityPage((prev) => Math.min(prev + 1, maxCityPage));
            setShouldFetchCityData(true);
          }}
          disabled={currentCityPage >= maxCityPage}
        >
          Next City Page
        </button>
      </div>
      <DistrictSalesChart
        chartData={districtChartData.slice(
          currentDistrictPage * itemsPerPage,
          (currentDistrictPage + 1) * itemsPerPage
        )}
        onDownload={handleDownloadDistrictData}
      />
      {/* Pagination for District Sales Chart */}
      <div className="pagination">
        <button
          onClick={() => {
            setCurrentDistrictPage((prev) => Math.max(prev - 1, 0));
            setShouldFetchDistrictData(true);
          }}
          disabled={currentDistrictPage <= 0}
        >
          Previous District Page
        </button>
        <span>
          District Page {currentDistrictPage + 1} of {maxDistrictPage + 1}
        </span>
        <button
          onClick={() => {
            setCurrentDistrictPage((prev) =>
              Math.min(prev + 1, maxDistrictPage)
            );
            setShouldFetchDistrictData(true);
          }}
          disabled={currentDistrictPage >= maxDistrictPage}
        >
          Next District Page
        </button>
      </div>
      <UploadModal onFileUpload={handleFileUpload} />
    </div>
  );
}

export default App;
