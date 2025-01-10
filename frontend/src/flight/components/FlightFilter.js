import React, { useState } from "react";
import "../styles/FlightFilter.scss";

const FlightFilter = ({ filters, onFilterChange, airlines = [] }) => {
  const [expandedSections, setExpandedSections] = useState({
    airline: true,
    departureTimeSort: true,
    lowestFare: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="filters">
      {/* 항공사 필터 */}
      <div className="filter-section">
        <h3
          onClick={() => toggleSection("airline")}
          className={expandedSections.airline ? "" : "collapsed"}
        >
          항공사
        </h3>
        {expandedSections.airline && (
          <select
            value={filters.airline}
            onChange={(e) => onFilterChange("airline", e.target.value)}
          >
            <option value="all">전체 항공사</option>
            {airlines.map((airline) => (
              <option key={airline.id} value={airline.airlineCode}>
                {airline.airlineName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 출발 시간 정렬 필터 */}
      <div className="filter-section">
        <h3
          onClick={() => toggleSection("departureTimeSort")}
          className={expandedSections.departureTimeSort ? "" : "collapsed"}
        >
          출발 시간 정렬
        </h3>
        {expandedSections.departureTimeSort && (
          <select
            value={filters.departureTimeSort}
            onChange={(e) =>
              onFilterChange("departureTimeSort", e.target.value)
            }
          >
            <option value="all">정렬 없음</option>
            <option value="asc">출발 시간: 빠른순</option>
            <option value="desc">출발 시간: 느린순</option>
          </select>
        )}
      </div>


     {/* 최적가 필터 */}
<div className="filter-section lowest-fare">
  <h3
    onClick={() => toggleSection("lowestFare")}
    className={expandedSections.lowestFare ? "" : "collapsed"}
  >
    최적가
  </h3>
  {expandedSections.lowestFare && (
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={filters.lowestFare}
        onChange={(e) => onFilterChange("lowestFare", e.target.checked)}
      />
      최적가
    </label>
  )}
</div>
    </div>
  );
};

export default FlightFilter;
