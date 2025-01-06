import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../scss/AirportApi.scss'; // SCSS 스타일 파일 임포트
import { useNavigate } from 'react-router-dom';
import BoardPagination from './BoardPagination'; // BoardPagination 컴포넌트 import (경로 확인)
import BasicLayout from "../../../common/layout/basicLayout/BasicLayout";  // 상대경로 확인


const FlightBoard = () => {
  const [flights, setFlights] = useState([]); // 전체 항공편 상태
  const [filteredFlights, setFilteredFlights] = useState([]); // 필터링된 항공편 상태
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    airport: '전체공항',
    date: '',
    startTime: '00:00',
    endTime: '00:00',
    flightNumber: '',
    airline: '',
  });

  const [currentPage, setCurrentPage] = useState(1); // currentPage와 setCurrentPage 상태 추가
  const [airlines, setAirlines] = useState([]); // 항공사 목록 상태 추가
  const navigate = useNavigate();

  const API_KEY = process.env.REACT_APP_API_KEY; // API Key
  const API_URL =
    'https://api.odcloud.kr/api/FlightStatusListDTL/v1/getFlightStatusListDetail?page=10&perPage=1000';
    
  const formatTime = (time) => {
    if (!time || time === '') return '-';

    const timeString = time.toString().padStart(4, '0');
    const hours = timeString.slice(0, 2); // '10'
    const minutes = timeString.slice(2); // '40'

    return `${hours}:${minutes}`; // '10:40'
  };

  const fetchFlightData = async () => {
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
  
      // 항공편 필터링 (시간 범위 필터 추가)
      const filtered = (response.data.data || []).filter((flight) => {
        const flightNumberMatch =
          !searchParams.flightNumber || flight.AIR_FLN.includes(searchParams.flightNumber);
        const airlineMatch =
          !searchParams.airline || flight.AIRLINE_KOREAN.includes(searchParams.airline);
  
        // 출발 시각(STD)을 시간 범위 (startTime <= STD <= endTime)로 필터링
        const flightTime = parseInt(flight.STD); // 출발 시각
        const startTimeInt = parseInt(searchParams.startTime.replace(':', '')); // startTime을 "HHMM" 형식으로 변환
        const endTimeInt = parseInt(searchParams.endTime.replace(':', '')); // endTime을 "HHMM" 형식으로 변환
  
        // 출발 시각이 startTime과 endTime 사이에 있을 경우만 필터링
        const timeMatch = flightTime >= startTimeInt && flightTime <= endTimeInt;
  
        return (
          (searchParams.airport === '전체공항' || flight.AIRPORT === searchParams.airport) &&
          flightNumberMatch && airlineMatch && timeMatch
        );
      });
  
      setFilteredFlights(filtered); // 필터링된 항공편 상태 업데이트

      // 출발 시각(STD)을 기준으로 오름차순 정렬
      const sorted = filtered.sort((a, b) => {
        const timeA = parseInt(a.STD) || 0;
        const timeB = parseInt(b.STD) || 0;
        return timeA - timeB;
      });

      setFlights(sorted); // 정렬된 항공편 상태 업데이트
    } catch (error) {
      console.error('항공편 데이터 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const itemsPerPage = 10; // 페이지당 항목 수
  const totalPages = Math.ceil(flights.length / itemsPerPage); // 총 페이지 수 계산

  const getCurrentPageData = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return flights.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지에 해당하는 데이터만 반환
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // 페이지 번호 변경
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 검색 시 첫 페이지로 초기화
    fetchFlightData();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 항공사 변경 시 운항편명 초기화
  const handleAirlineChange = (e) => {
    setSearchParams((prev) => ({
      ...prev,
      airline: e.target.value,
      flightNumber: '', // 항공사 선택 시 운항편명 초기화
    }));
  };

  useEffect(() => {
    // 현재 날짜와 시간을 자동으로 설정
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로
    const currentHour = today.getHours().toString().padStart(2, '0'); // HH
    const currentMinute = today.getMinutes().toString().padStart(2, '0'); // MM

    const startTime = `${currentHour}:${'00'}`;
    const endTime = `${currentHour}:${'59'}`;

    setSearchParams((prev) => ({
      ...prev,
      date: currentDate,
      startTime: startTime, 
      endTime: endTime,
    }));
  }, []); // 첫 페이지 로드 시 초기 날짜와 시간을 설정

  useEffect(() => {
    fetchFlightData();
  }, [searchParams]);

  return (
    <BasicLayout>
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

            {/* 항공사 선택 필드 추가 */}
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

            {/* 항공편명 검색 필드 추가 */}
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
                      <td>{flight.GATE || '-'}</td>
                      <td>{flight.RMK_KOR || '-'}</td>
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
    </BasicLayout>
  );
};

export default FlightBoard;
