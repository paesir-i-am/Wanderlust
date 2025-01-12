import React, { useState, useEffect } from "react";
import axios from "axios";
import "../scss/AirportApi.scss";
import { useLocation, useNavigate } from "react-router-dom";
import BoardPagination from "./BoardPagination";
import BasicLayout from "../../../common/layout/basicLayout/BasicLayout";
import BasicLayoutWithoutFlight from "../../../common/layout/basicLayout/BasicLayoutWithoutFlight";

const FlightBoard = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [airlines, setAirlines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    airport: "전체공항",
    date: "",
    startTime: "00:00",
    endTime: "23:59",
    flightNumber: "",
    airline: "",
  });

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  // Update searchParams state when query params change
  useEffect(() => {
    const query = {
      airport: queryParams.get("airport") || "전체공항",
      date: queryParams.get("date") || "",
      startTime: queryParams.get("startTime") || "00:00",
      endTime: queryParams.get("endTime") || "23:59",
      flightNumber: queryParams.get("flightNumber") || "",
      airline: queryParams.get("airline") || "",
    };
    setSearchParams(query);
  }, [search]);

  const API_KEY =
    "avIxlq6XN/0crEeax8d+HGElMGY8J1E6a/EY358qYCM76vlbrSc7kYq3k8b0176nerPo5F5gctlWCqKm/pOYrg==";
  const API_URL =
    "https://api.odcloud.kr/api/FlightStatusListDTL/v1/getFlightStatusListDetail?page=10&perPage=1000";

  const formatTime = (time) => {
    if (!time || time === "") return "-";
    const timeString = time.toString().padStart(4, "0");
    const hours = timeString.slice(0, 2);
    const minutes = timeString.slice(2);
    return `${hours}:${minutes}`;
  };

  const fetchFlightData = async () => {
    if (!searchParams) return; // searchParams가 없으면 함수 종료
    setLoading(true);

    try {
      const response = await axios.get(API_URL, {
        params: {
          serviceKey: API_KEY,
          airport: searchParams.airport,
          date: searchParams.date,
          startTime: searchParams.startTime,
          endTime: searchParams.endTime,
        },
      });

      const airlineList = [
        ...new Set(response.data.data.map((flight) => flight.AIRLINE_KOREAN)),
      ];
      setAirlines(airlineList.sort());

      const filtered = (response.data.data || []).filter((flight) => {
        const flightNumberMatch =
          !searchParams.flightNumber ||
          flight.AIR_FLN.includes(searchParams.flightNumber);
        const airlineMatch =
          !searchParams.airline ||
          flight.AIRLINE_KOREAN.includes(searchParams.airline);

        const flightTime = parseInt(flight.STD);
        const startTimeInt = parseInt(searchParams.startTime.replace(":", ""));
        const endTimeInt = parseInt(searchParams.endTime.replace(":", ""));

        const timeMatch =
          flightTime >= startTimeInt && flightTime <= endTimeInt;

        return (
          (searchParams.airport === "전체공항" ||
            flight.AIRPORT === searchParams.airport) &&
          flightNumberMatch &&
          airlineMatch &&
          timeMatch
        );
      });

      const sorted = filtered.sort((a, b) => {
        const timeA = parseInt(a.STD) || 0;
        const timeB = parseInt(b.STD) || 0;
        return timeA - timeB;
      });

      setFilteredFlights(filtered);
      setFlights(sorted);
    } catch (error) {
      console.error("항공편 데이터 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(flights.length / itemsPerPage);

  const getCurrentPageData = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return flights.slice(indexOfFirstItem, indexOfLastItem);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // Fetch flight data after search parameters change
    fetchFlightData();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAirlineChange = (e) => {
    setSearchParams((prev) => ({
      ...prev,
      airline: e.target.value,
      flightNumber: "", // Reset flight number when airline changes
    }));
  };

  useEffect(() => {
    fetchFlightData(); // searchParams 값이 변경되었을 때마다 데이터를 가져옴
  }, [searchParams]);

  return (
    <BasicLayoutWithoutFlight>
      <div className="flight-board-container">
        <h2>실시간 항공편 상세 조회</h2>
        <div className="flight-board-search">
          <form onSubmit={handleSearch} className="search-form">
            <select
              name="airport"
              value={searchParams.airport}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="전체공항">전체공항</option>
              <option value="ICN">인천</option>
              <option value="GMP">김포</option>
              <option value="CJU">제주</option>
              <option value="PUS">김해</option>
              <option value="TAE">대구</option>
              <option value="CJJ">청주</option>
            </select>

            <input
              type="date"
              name="date"
              value={searchParams.date}
              onChange={handleInputChange}
              className="input-field"
            />

            <input
              type="time"
              name="startTime"
              value={searchParams.startTime}
              onChange={handleInputChange}
              className="input-field"
            />

            <input
              type="time"
              name="endTime"
              value={searchParams.endTime}
              onChange={handleInputChange}
              className="input-field"
            />

            <select
              name="airline"
              value={searchParams.airline}
              onChange={handleAirlineChange}
              className="input-field"
            >
              <option value="">전체 항공사</option>
              {airlines.map((airline, index) => (
                <option key={index} value={airline}>
                  {airline}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="flightNumber"
              value={searchParams.flightNumber}
              onChange={handleInputChange}
              placeholder="항공편명 검색"
              className="input-field"
            />

            <button type="submit" className="search-button">
              검색하기
            </button>
          </form>
        </div>

        {loading ? (
          <div className="loading-text">데이터를 불러오는 중...</div>
        ) : (
          <>
            <div className="flight-board-table-container">
              <table className="flight-board-table">
                <thead>
                  <tr>
                    <th>출발시각</th>
                    <th>목적지</th>
                    <th>항공사</th>
                    <th>항공편명</th>
                    <th>탑승구</th>
                    <th>운항상태</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageData().map((flight, index) => (
                    <tr key={flight.UFID || index}>
                      <td>{formatTime(flight.STD)}</td>
                      <td>{flight.ARRIVED_KOR}</td>
                      <td>{flight.AIRLINE_KOREAN}</td>
                      <td>{flight.AIR_FLN}</td>
                      <td>{flight.GATE || "-"}</td>
                      <td>{flight.RMK_KOR || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <BoardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </BasicLayoutWithoutFlight>
  );
};

export default FlightBoard;
