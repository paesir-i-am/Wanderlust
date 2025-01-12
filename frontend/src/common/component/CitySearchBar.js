import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/mainApi";

const CitySearchBar = forwardRef((props, ref) => {
  const [searchValue, setSearchValue] = useState(""); // 검색 값 상태
  const navigate = useNavigate();

  // 검색 처리 함수
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      alert("도시명을 입력해주세요.");
      return;
    }

    try {
      const response = await axiosInstance.get(
        `tour/read/by-city/${searchValue}`,
      );

      const tourId = response.data; // 백엔드에서 반환한 tourId
      if (tourId) {
        navigate(`/tour/read/${tourId}`); // tourId로 리다이렉트
        setSearchValue(""); // 검색 필드 초기화
      } else {
        alert("검색된 결과가 없습니다.");
      }
    } catch (error) {
      console.error("Error fetching tourId:", error);
      alert("City not found or an error occurred.");
    }
  };

  // 부모 컴포넌트에서 handleSearch를 호출할 수 있도록 expose
  useImperativeHandle(ref, () => ({
    handleSearch,
  }));

  return (
    <input
      type="text"
      placeholder="도시명을 입력하세요 (예: 서울, 제주도, 파리 등)"
      className="search-input"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearch(); // 엔터키로 검색
        }
      }}
    />
  );
});

export default CitySearchBar;
