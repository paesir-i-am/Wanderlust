import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlightFilter from "../components/FlightFilter";
import "../styles/FlightList.scss";
import airplaneImg from "../img/airplane.png"; // 경로 수정

import BasicLayout from "../../common/layout/basicLayout/BasicLayout";

const FlightList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [filters, setFilters] = useState({
    airline: "all",
    departureTimeSort: "all", // "asc" 또는 "desc"
    lowestFare: false,
    departureAirport: "",
    arrivalAirport: "",
  });

  const searchInfo = location.state?.searchInfo || {
    departure: "",
    departureCode: "",
    arrival: "",
    arrivalCode: "",
    dates: "",
    passengers: "",
  };

  const parseDate = (time) => {
    if (!time || time.length !== 12) return null;
    const year = parseInt(time.slice(0, 4), 10);
    const month = parseInt(time.slice(4, 6), 10) - 1; // 월은 0부터 시작
    const day = parseInt(time.slice(6, 8), 10);
    const hour = parseInt(time.slice(8, 10), 10);
    const minute = parseInt(time.slice(10, 12), 10);
    return new Date(year, month, day, hour, minute);
  };

  const addDurations = (duration1, duration2) => {
    if (!duration1 || !duration2) return "정보 없음";

    const hours1 = parseInt(duration1.slice(0, 2), 10) || 0;
    const minutes1 = parseInt(duration1.slice(2, 4), 10) || 0;

    const hours2 = parseInt(duration2.slice(0, 2), 10) || 0;
    const minutes2 = parseInt(duration2.slice(2, 4), 10) || 0;

    const totalMinutes = minutes1 + minutes2;
    const totalHours = hours1 + hours2 + Math.floor(totalMinutes / 60);

    const remainingMinutes = totalMinutes % 60;

    return `${totalHours}시간 ${remainingMinutes}분`;
  };

  // 숫자 포맷팅 함수
  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "정보 없음";
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const formatTime = (time) => {
    if (!time) return "정보 없음";
    const year = time.slice(0, 4);
    const month = time.slice(4, 6);
    const day = time.slice(6, 8);
    const hour = parseInt(time.slice(8, 10), 10);
    const minute = time.slice(10, 12);
    const period = hour < 12 ? "오전" : "오후";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${year}-${month}-${day} ${period} ${displayHour}:${minute}`;
  };

  // 'HHMM' 형식의 시간을 "X시간 Y분" 형식으로 변환
  const formatJourneyTime = (journeyTime) => {
    if (!journeyTime) return "정보 없음";

    const hours = parseInt(journeyTime.slice(0, 2), 10); // 시간
    const minutes = parseInt(journeyTime.slice(2, 4), 10); // 분

    return `${hours}시간 ${minutes}분`; // 변환된 시간과 분
  };

  useEffect(() => {
    if (location.state?.results) {
      const {
        schedules = [],
        fares = [],
        airlines = [],
      } = location.state.results;

      const filteredFares = fares.filter((fare) => !fare.fareKey.includes("+"));

      // 항공사 코드 -> 이름 매핑 객체 생성
      const airlineMap = airlines.reduce((map, airline) => {
        map[airline.airline_code] = airline.airline_name; // 항공사 코드로 이름 매핑
        return map;
      }, {});

      console.log("Airline Map: ", airlineMap);
      const mergedData = schedules.map((schedule, index) => ({
        ...schedule,
        fareDetail: filteredFares[index] || {
          adultFare: "정보 없음",
          childFare: "정보 없음",
          infantFare: "정보 없음",
        },
        airlineName: airlineMap[schedule.airlineCode] || "정보 없음",
      }));

      setData(mergedData);

      setAirlines(
        airlines.map((airline) => ({
          id: airline.id || airline.airline_id,
          airlineCode: airline.code || airline.airline_code,
          airlineName: airline.name || airline.airline_name,
        }))
      );

      const grouped = [];
      const usedIds = new Set();

      mergedData.forEach((schedule) => {
        if (usedIds.has(schedule.id)) return;

        const returnFlight = mergedData.find(
          (s) =>
            s.departureAirport === schedule.arrivalAirport &&
            s.arrivalAirport === schedule.departureAirport &&
            s.airlineCode === schedule.airlineCode
        );

        let departure = schedule;
        let returnFlightAdjusted = returnFlight;

        if (
          returnFlight &&
          parseDate(returnFlight.departureTime) <
            parseDate(schedule.departureTime)
        ) {
          [departure, returnFlightAdjusted] = [returnFlight, schedule];
        }

        grouped.push({
          departure,
          return: returnFlightAdjusted,
        });

        usedIds.add(departure.id);
        if (returnFlightAdjusted) usedIds.add(returnFlightAdjusted.id);
      });

      setGroupedData(grouped);
    }
  }, [location.state]);

  const handleSelect = (group) => {
    const adultFare = parseInt(group.departure.fareDetail.adultFare, 10) || 0;
    const childFare = parseInt(group.departure.fareDetail.childFare, 10) || 0;
    const infantFare = parseInt(group.departure.fareDetail.infantFare, 10) || 0;

    const totalPrice =
      adultFare * searchInfo.adult +
      childFare * searchInfo.child +
      infantFare * searchInfo.infant; // 모든 요금을 합산

    navigate("/payment", {
      state: {
        totalPrice,
        passengers: {
          adults: searchInfo.adult,
          children: searchInfo.child,
          infants: searchInfo.infant,
        },
      },
    });
  };

  const getFilteredAndSortedData = () => {
    const filteredData = groupedData.filter((group) => {
      if (!group.departure.direct) {
        return false;
      }
      if (
        filters.departureAirport &&
        group.departure.departureAirport !== filters.departureAirport
      ) {
        return false;
      }

      if (
        filters.arrivalAirport &&
        group.departure.arrivalAirport !== filters.arrivalAirport
      ) {
        return false;
      }

      if (
        filters.airline !== "all" &&
        group.departure.airlineCode !== filters.airline
      ) {
        return false;
      }

      return true;
    });

    // 2. 정렬: 필터링된 데이터를 기준으로 정렬
    const sortedData = [...filteredData]; // 배열 복사

    sortedData.sort((a, b) => {
      // 2.1. 요금(가장 낮은 요금 기준)
      if (filters.lowestFare) {
        const fareA = parseInt(a.departure.fareDetail.adultFare) || Infinity;
        const fareB = parseInt(b.departure.fareDetail.adultFare) || Infinity;
        return fareA - fareB; // 낮은 가격 순으로 정렬
      }

      // 2.2. 출발 시간 순 정렬 (오름차순)
      if (filters.departureTimeSort === "asc") {
        return (
          parseDate(a.departure.departureTime) -
          parseDate(b.departure.departureTime)
        );
      }

      // 2.3. 출발 시간 순 정렬 (내림차순)
      if (filters.departureTimeSort === "desc") {
        return (
          parseDate(b.departure.departureTime) -
          parseDate(a.departure.departureTime)
        );
      }

      return 0; // 기본적으로 정렬되지 않음
    });

    return sortedData; // 정렬된 데이터를 반환
  };

  return (
    <BasicLayout>
      <div className="flight-list-container">
        <div className="search-summary">
          <h2>
            {searchInfo.departure} <span>{searchInfo.departureCode || ""}</span>{" "}
            - {searchInfo.arrival} <span>{searchInfo.arrivalCode || ""}</span>
          </h2>
          <p>
            {searchInfo.dates || "날짜 정보 없음"} |{" "}
            {searchInfo.passengers || "승객 정보 없음"}
          </p>
        </div>
        <div className="list-content">
          <div className="filter-sidebar">
            <FlightFilter
              filters={filters}
              onFilterChange={(name, value) =>
                setFilters((prevFilters) => ({ ...prevFilters, [name]: value }))
              }
              airlines={airlines}
            />
          </div>
          <div className="flight-list">
            {getFilteredAndSortedData().map((group, index) => (
              <div className="flight-card" key={index}>
                <div className="airline-info">
                  <h4>
                    {group.departure.airlineName || group.departure.airlineCode}
                  </h4>
                </div>
                <div className="flight-info">
                  <div className="route">
                    <div className="time">
                      {formatTime(group.departure.departureTime)}
                    </div>
                    <div className="airport-code">
                      {group.departure.departureAirport}
                    </div>
                    <img className="plane-icon" src={airplaneImg} alt="plane" />
                    <div className="time2">
                      {formatTime(group.departure.arrivalTime)}
                    </div>
                    <div className="airport-code2">
                      {group.departure.arrivalAirport}
                    </div>
                  </div>

                  {group.return && (
                    <div className="route2">
                      <span className="time">
                        {formatTime(group.return.departureTime)}
                      </span>
                      <span className="airport-code">
                        {group.return.departureAirport}
                      </span>
                      <img
                        className="plane-icon"
                        src={airplaneImg}
                        alt="plane"
                      />
                      <span className="time2">
                        {formatTime(group.return.arrivalTime)}
                      </span>
                      <span className="airport-code2">
                        {group.return.arrivalAirport}
                      </span>
                    </div>
                  )}
                </div>
                <div className="divider"></div> {/* 중간 선 추가 */}
                <div className="price-info">
                  {group.return ? (
                    <p className="price round-trip">
                      왕복{" "}
                      {addDurations(
                        group.departure.journeyTime,
                        group.return.journeyTime
                      )}{" "}
                      ~
                      <br />
                      왕복{" "}
                      {formatPrice(
                        (parseInt(group.departure.fareDetail.adultFare, 10) ||
                          0) *
                          searchInfo.adult +
                          (parseInt(group.departure.fareDetail.childFare, 10) ||
                            0) *
                            searchInfo.child +
                          (parseInt(
                            group.departure.fareDetail.infantFare,
                            10
                          ) || 0) *
                            searchInfo.infant
                      )}{" "}
                      ~
                    </p>
                  ) : (
                    <p className="price one-way">
                      <div className="oneway1">
                        편도 {formatJourneyTime(group.departure.journeyTime)} ~
                        <br />
                      </div>
                      <div className="oneway2">
                        편도{" "}
                        {formatPrice(
                          (parseInt(group.departure.fareDetail.adultFare, 10) ||
                            0) *
                            searchInfo.adult +
                            (parseInt(
                              group.departure.fareDetail.childFare,
                              10
                            ) || 0) *
                              searchInfo.child +
                            (parseInt(
                              group.departure.fareDetail.infantFare,
                              10
                            ) || 0) *
                              searchInfo.infant
                        )}{" "}
                        ~
                      </div>
                    </p>
                  )}
                  {/* 선택하기 버튼 추가 */}
                  <button
                    className="select-button"
                    onClick={() => handleSelect(group)}
                  >
                    선택하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default FlightList;
