import React, { useEffect } from "react";
import "../scss/map/Travel.scss";

const Travel = ({ travelMode, setTravelMode, isGlobalCity }) => {
  // 전 세계 도시 검색 시, 대중교통 모드로 자동 설정
  useEffect(() => {
    if (isGlobalCity) {
      setTravelMode("TRANSIT");
    }
  }, [isGlobalCity, travelMode, setTravelMode]);

  return <div className="controls"></div>;
};

export default Travel;
