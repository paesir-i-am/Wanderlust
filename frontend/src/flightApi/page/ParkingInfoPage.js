import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ParkingInfoPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(search);
  const [selectedTerminal, setSelectedTerminal] = useState(
    queryParams.get("terminal") || "T1",
  ); // 기본값 'T1'
  const [selectedParkingType, setSelectedParkingType] = useState(
    queryParams.get("parkingType") || "short",
  ); // 기본값 'short'

  // 터미널 선택 버튼 클릭 이벤트 핸들러
  const handleTerminalChange = (terminal) => {
    setSelectedTerminal(terminal);
  };

  // 주차장 유형 선택 버튼 클릭 이벤트 핸들러
  const handleParkingTypeChange = (type) => {
    setSelectedParkingType(type);
  };

  // "검색하기" 버튼 클릭 시 페이지 이동
  const handleSearchClick = () => {
    // 두 값 모두 설정된 상태에서만 페이지 이동
    if (selectedTerminal && selectedParkingType) {
      navigate(
        `/flightApi/parking-info?terminal=${selectedTerminal}&parkingType=${selectedParkingType}`,
      );
    }
  };

  return (
    <div className="parking-info-page">
      {/* 배너 영역 */}
      <div className="parking-info-banner-container">
        <div className="parking-info-banner">
          <p>주차장 정보 검색</p>
        </div>
      </div>

      <div className="selected-info">
        {/* 선택된 터미널과 주차장 유형 텍스트 */}
        <div className="selected-info-text">
          <p>
            <strong>선택된 터미널:</strong>{" "}
            {selectedTerminal === "T1" ? "제 1 여객터미널" : "제 2 여객터미널"}
          </p>
          <p>
            <strong>선택된 주차장 유형:</strong>{" "}
            {selectedParkingType === "short" ? "단기주차장" : "장기주차장"}
          </p>
        </div>

        {/* 터미널 선택 버튼 */}
        <div className="terminal-button">
          {["T1", "T2"].map((terminal) => (
            <button
              key={terminal}
              onClick={() => handleTerminalChange(terminal)}
              className={`button ${selectedTerminal === terminal ? "active" : ""}`}
            >
              {terminal === "T1" ? "제 1 여객터미널" : "제 2 여객터미널"}
            </button>
          ))}
        </div>

        {/* 주차장 유형 선택 버튼 */}
        <div className="parking-type-button">
          {["short", "long"].map((type) => (
            <button
              key={type}
              onClick={() => handleParkingTypeChange(type)}
              className={`button ${selectedParkingType === type ? "active" : ""}`}
            >
              {type === "short" ? "단기주차장" : "장기주차장"}
            </button>
          ))}
        </div>

        {/* 검색하기 버튼 */}
        <div className="search-button-container">
          <button onClick={handleSearchClick} className="search-button">
            검색하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingInfoPage;
