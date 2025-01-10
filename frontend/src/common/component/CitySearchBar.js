import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tourListApi } from "../../tour/api/tourListApi";

const CitySearchBar = () => {
  const [searchValue, setSearchValue] = useState(""); // 검색 값 상태
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    try {
      // tourListApi 사용
      const tours = await tourListApi.getTourListByCityName(searchValue);

      if (tours && tours.length > 0) {
        // tours[0]를 사용하여 첫 번째 투어 정보를 state로 전달
        navigate(`/tour/read/${searchValue}`, {
          state: {
            selectedTour: tours[0],
            lat: tours[0].latitude,
            lng: tours[0].longitude,
          },
        });
      } else {
        alert("해당 도시의 여행지는 조회가 되지 않습니다.");
      }
    } catch (error) {
      console.error("API 호출 중 오류 발생:", error);
      alert("해당 도시의 여행지는 조회가 되지 않습니다.");
    }
  };

  return (
    <input
      type="text"
      placeholder="도시명을 입력하세요 (예: 서울, 인천, 제주)"
      className="search-input"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSearch(); // Enter 키로 검색
      }}
    />
  );
};

export default CitySearchBar;
