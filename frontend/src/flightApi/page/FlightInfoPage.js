import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FlightInfoPage = () => {
  const [searchParams, setSearchParams] = useState({
    destination: "전체 목적지",
    date: "",
    startTime: "00:00",
    endTime: "23:59",
    flightNumber: "",
    airline: "",
  });

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    // 쿼리 파라미터를 searchParams의 값으로 설정
    const queryParams = new URLSearchParams({
      destination: searchParams.destination,
      date: searchParams.date,
      startTime: searchParams.startTime,
      endTime: searchParams.endTime,
    });

    if (searchParams.flightNumber) {
      queryParams.append("flightNumber", searchParams.flightNumber);
    }
    if (searchParams.airline) {
      queryParams.append("airline", searchParams.airline);
    }

    // 콘솔로 쿼리 파라미터 확인
    console.log(queryParams.toString());

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
      flightNumber: "", // 항공사 변경 시 항공편명 초기화
    }));
  };

  return (
    <div className="flights-page-container">
      <div className="flights-banner-container">
        <div className="flights-page-banner">
          <p>실시간 항공편 검색</p>
        </div>
      </div>
      <div className="flight-page-search">
        <form onSubmit={handleSearch} className="search-form">
          {/* 목적지 선택 */}
          <select
            name="destination"
            value={searchParams.destination}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="목적지 선택">목적지 선택</option>
            <option value="괌">괌</option>
            <option value="광주">광주</option>
            <option value="나트랑">나트랑</option>
            <option value="다낭">다낭</option>
            <option value="대구">대구</option>
            <option value="도쿄/하네다">도쿄/하네다</option>
            <option value="후쿠오카">후쿠오카</option>
            <option value="오사카/간사이">오사카/간사이</option>
            <option value="방콕/방콕/수완나품">방콕/방콕/수완나품</option>
            <option value="무안">무안</option>
            <option value="인천">인천</option>
            <option value="세부">세부</option>
            <option value="제주">제주</option>
            <option value="청주">청주</option>
            <option value="부산/김해">부산/김해</option>
            <option value="베이징/다싱">베이징/다싱</option>
            <option value="상하이/홍차오">상하이/홍차오</option>
            <option value="타이페이/타오위안">타이페이/타오위안</option>
            <option value="코타키나발루">코타키나발루</option>
            <option value="칼리보">칼리보</option>
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
            <option value="">항공사 선택</option>
            <option value="대한항공">대한항공</option>
            <option value="아시아나항공">아시아나항공</option>
            <option value="진에어">진에어</option>
            <option value="제주항공">제주항공</option>
            <option value="티웨이항공">티웨이항공</option>
            <option value="퍼시픽항공">퍼시픽항공</option>
            <option value="이스타항공">이스타항공</option>
            <option value="비엣젯항공">비엣젯항공</option>
            <option value="필리핀항공">필리핀항공</option>
            <option value="에어로케이항공">에어로케이항공</option>
            <option value="에어부산">에어부산</option>
            <option value="에어서울">에어서울</option>
            <option value="일본항공">일본항공</option>
            <option value="상해항공">상해항공</option>
            <option value="중국국제항공">중국국제항공</option>
            <option value="중국남방항공">중국남방항공</option>
            <option value="중국동방항공">중국동방항공</option>
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
