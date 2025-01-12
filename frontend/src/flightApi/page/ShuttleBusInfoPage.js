import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ShuttleBusInfoPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);
  const initialTerminal = queryParams.get("terminal") || "T1"; // 기본값은 'T1'

  const [selectedTerminal, setSelectedTerminal] = useState(initialTerminal);

  const handleTerminalChange = (terminal) => {
    setSelectedTerminal(terminal);
  };

  const handleSearchClick = () => {
    navigate(`/flightApi/shuttlebus-info?terminal=${selectedTerminal}`);
  };

  useEffect(() => {
    const terminalFromQuery = queryParams.get("terminal");
    if (terminalFromQuery) {
      setSelectedTerminal(terminalFromQuery);
    }
  }, [search]);

  return (
    <div className="shuttlebus-info-page">
      <div className="shuttlebus-info-banner">
        <p>셔틀버스 정보 검색</p>
      </div>

      <div className="selected-info">
        <p>
          <strong>선택된 터미널:</strong>{" "}
          {selectedTerminal === "T1" ? "제 1 여객터미널" : "제 2 여객터미널"}
        </p>

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

        <div className="search-button-container">
          <button onClick={handleSearchClick} className="search-button">
            검색하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShuttleBusInfoPage;
