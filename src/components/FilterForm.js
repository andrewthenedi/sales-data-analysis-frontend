import React, { useState } from "react";
import "./FilterForm.css";

function FilterForm({ onFilterSubmit, cityOptions = [] }) {
  const [startDate, setStartDate] = useState("2024-04-10");
  const [endDate, setEndDate] = useState("2024-04-10");
  const [startTime, setStartTime] = useState("05:00:00");
  const [endTime, setEndTime] = useState("12:00:00");
  const [selectedCities, setSelectedCities] = useState([]);
  const [qtyThreshold, setQtyThreshold] = useState("");

  const handleCityChange = (city) => {
    const isSelected = selectedCities.includes(city);
    setSelectedCities((prev) =>
      isSelected ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    if (startDateTime > endDateTime) {
      alert("Start date/time must be before end date/time.");
      return;
    }
    onFilterSubmit({
      startDate,
      endDate,
      startTime,
      endTime,
      selectedCities,
      qtyThreshold,
    });
  };

  return (
    <div className="filter-form">
      <form onSubmit={handleSubmit}>
        {/* Date and Time Filters */}
        <div className="form-group">
          <label htmlFor="start-date">Start Date:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="end-date">End Date:</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="start-time">Start Time:</label>
          <input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="end-time">End Time:</label>
          <input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        {/* Checkboxes for City/District Selection */}
        <fieldset>
          <legend>City/District</legend>
          {cityOptions.map((city) => (
            <div key={city}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCities.includes(city)}
                  onChange={() => handleCityChange(city)}
                />
                {city}
              </label>
            </div>
          ))}
        </fieldset>

        {/* Quantity Threshold Input */}
        <div className="form-group">
          <label htmlFor="qty-threshold">Quantity Threshold:</label>
          <input
            id="qty-threshold"
            type="number"
            value={qtyThreshold}
            onChange={(e) => setQtyThreshold(e.target.value)}
            min="0"
          />
        </div>
        <button type="submit" className="submit-button">
          Apply Filters
        </button>
      </form>
    </div>
  );
}

export default FilterForm;
