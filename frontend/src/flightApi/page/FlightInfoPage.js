import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FlightInfoPage.scss';

const FlightInfoPage = () => {
  const [searchParams, setSearchParams] = useState({
    airport: '전체공항',
    date: '',
    startTime: '00:00',
    endTime: '23:59',
    flightNumber: '',
    airline: '',
  });

  const navigate = useNavigate();

  // 검색 버튼 클릭 시 쿼리 파라미터로 URL을 업데이트하여 FlightBoard로 이동
  const handleSearch = (e) => {
    e.preventDefault(); // 기본 폼 제출 방지

    // 쿼리 파라미터를 searchParams의 값으로 설정
    const queryParams = new URLSearchParams({
      airport: searchParams.airport,
      date: searchParams.date, // 사용자가 선택한 날짜
      startTime: searchParams.startTime, // 사용자가 선택한 시작 시간
      endTime: searchParams.endTime, // 사용자가 선택한 종료 시간
      flightNumber: searchParams.flightNumber || '', // 항공편명 (없으면 빈 문자열)
      airline: searchParams.airline || '', // 항공사 (없으면 빈 문자열)
    });

    // navigate를 사용하여 쿼리 파라미터가 포함된 URL로 이동
    navigate(`/flightApi/flight-board?${queryParams.toString()}`);
  };

  // 입력값 변경 시 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value, // 입력된 값으로 상태 업데이트
    }));
  };

  // 항공사 선택 시 항공편명 초기화
  const handleAirlineChange = (e) => {
    setSearchParams((prev) => ({
      ...prev,
      airline: e.target.value,
      flightNumber: '', // 항공사 변경 시 항공편명 초기화
    }));
  };

  return (
      <div className="flight-page-container">
        <div className="flight-banner-container">
          <div className="flight-page-banner">
            <p>실시간 항공편 조회</p>
          </div>
        </div>
        <div className="flight-page-search">
          <form onSubmit={handleSearch} className="search-form">
            {/* 공항 선택 */}
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

            {/* 날짜 선택 */}
            <input
              type="date"
              name="date"
              value={searchParams.date}
              onChange={handleInputChange}
              className="input-field"
            />

            {/* 시작 시간 선택 */}
            <input
              type="time"
              name="startTime"
              value={searchParams.startTime}
              onChange={handleInputChange}
              className="input-field"
            />

            {/* 종료 시간 선택 */}
            <input
              type="time"
              name="endTime"
              value={searchParams.endTime}
              onChange={handleInputChange}
              className="input-field"
            />

            {/* 항공사 선택 */}
            <select
              name="airline"
              value={searchParams.airline}
              onChange={handleAirlineChange}
              className="input-field"
            >
              <option value="">전체 항공사</option>
              <option value="대한항공">대한항공</option>
              <option value="아시아나">아시아나</option>
              <option value="진에어">진에어</option>
              <option value="제주항공">제주항공</option>
              <option value="티웨이항공">티웨이항공</option>
              <option value="퍼시픽항공">퍼시픽항공</option>
              <option value="이스타항공">이스타항공</option>
              <option value="비엣젯항공">비엣젯항공</option>
              <option value="에어부산">에어부산</option>
              <option value="에어서울">에어서울</option>
              <option value="일본항공">일본항공</option>
              <option value="중국국제항공">중국국제항공</option>
              <option value="중화항공">중화항공</option>
              <option value="하이에어">하이에어</option>
            </select>
            {/* 항공편명 입력 */}
            <input
              type="text"
              name="flightNumber"
              value={searchParams.flightNumber}
              onChange={handleInputChange}
              placeholder="항공편명 검색"
              className="input-field"
            />

            {/* 검색 버튼 */}
            <button type="submit" className="search-button">
              검색하기
            </button>
          </form>
        </div>
      </div>
  );
};

export default FlightInfoPage;
