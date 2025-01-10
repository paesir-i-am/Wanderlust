import React, { useState, useEffect, useCallback } from "react";
import "../scss/map/PlaceList.scss";

const PlaceList = ({ places, currentLocation, onPlaceClick }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedRadius, setSelectedRadius] = useState(null);
  const [placesWithDistances, setPlacesWithDistances] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  // 거리 계산 함수
  const calculateDistances = useCallback((places, currentLocation) => {
    const google = window.google;
    return places.map((place) => {
      if (!place.geometry || !place.geometry.location) return place;
      const placeLocation = place.geometry.location;
      if (currentLocation) {
        const distanceInMeters =
          google.maps.geometry.spherical.computeDistanceBetween(
            currentLocation,
            placeLocation,
          );
        return { ...place, distance: distanceInMeters / 1000 }; // km 단위로 변환
      }
      return place;
    });
  }, []);

  // 거리 계산과 필터링 초기화
  useEffect(() => {
    if (currentLocation) {
      const updatedPlaces = calculateDistances(places, currentLocation);
      setPlacesWithDistances(updatedPlaces);
      setFilteredPlaces(updatedPlaces); // 초기 필터링되지 않은 목록 설정
    }
  }, [places, currentLocation, calculateDistances]);

  // 필터 변경 함수 (공통)
  const handleFilterChange = (value, type) => {
    if (type === "rating") {
      setSelectedRating((prev) => (prev === value ? null : value));
    } else if (type === "radius") {
      setSelectedRadius((prev) => (prev === value ? null : value));
    }
  };

  // 필터링 로직
  const applyFilters = useCallback(() => {
    let newFilteredPlaces = [...placesWithDistances];

    // 공통 필터 로직
    const filterByCondition = (items, condition, key) =>
      items.filter((place) => condition(place[key] || 0));

    if (selectedRating) {
      newFilteredPlaces = filterByCondition(
        newFilteredPlaces,
        (rating) => {
          if (selectedRating === "2~3점") return rating >= 2 && rating < 3;
          if (selectedRating === "3~4점") return rating >= 3 && rating < 4;
          if (selectedRating === "4~4.5점") return rating >= 4 && rating < 4.5;
          if (selectedRating === "4.5점 이상") return rating >= 4.5;
          return false;
        },
        "rating",
      );
    }

    if (selectedRadius) {
      newFilteredPlaces = filterByCondition(
        newFilteredPlaces,
        (distance) => {
          if (selectedRadius === "1km이하") return distance <= 1;
          if (selectedRadius === "3km이상") return distance >= 3;
          if (selectedRadius === "5km이상") return distance >= 5;
          if (selectedRadius === "10km이하") return distance <= 10;
          return false;
        },
        "distance",
      );
    }

    setFilteredPlaces(newFilteredPlaces);
  }, [placesWithDistances, selectedRating, selectedRadius]);

  return (
    <div className="place-list-container">
      {/* 필터 사이드바 */}
      <div className="filter-sidebar">
        <h3>필터</h3>

        {/* 필터 그룹 */}
        <FilterGroup
          title="평점 필터"
          options={["2~3점", "3~4점", "4~4.5점", "4.5점 이상"]}
          selectedOption={selectedRating}
          onOptionChange={(value) => handleFilterChange(value, "rating")}
        />
        <FilterGroup
          title="거리 필터"
          options={["1km이하", "3km이상", "5km이상", "10km이하"]}
          selectedOption={selectedRadius}
          onOptionChange={(value) => handleFilterChange(value, "radius")}
        />

        {/* 필터 적용 버튼 */}
        <div className="filter-button-container">
          <button onClick={applyFilters} className="filter-button">
            필터 적용
          </button>
        </div>
      </div>

      {/* 검색 결과 목록 */}
      <div className="place-list">
        <h3>검색 결과</h3>
        {filteredPlaces.length === 0 ? (
          <p className="no-places-message">검색된 장소가 없습니다.</p>
        ) : (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {filteredPlaces.map((place, index) => {
              // place_id 또는 index를 사용하여 고유한 key 설정
              const key = place.place_id || `place-${index}`;
              return (
                <li key={key} className="place-item">
                  <div className="place-item-info">
                    <h4 className="place-item-name">{place.name}</h4>
                    <p className="place-item-address">
                      {place.vicinity ||
                        place.formatted_address ||
                        "주소 정보 없음"}
                    </p>
                    <div className="place-item-details">
                      <span>
                        평점:{" "}
                        {place.rating
                          ? `${place.rating.toFixed(1)}점`
                          : "정보 없음"}
                      </span>
                      <span>
                        거리:{" "}
                        {place.distance
                          ? `${place.distance.toFixed(2)} km`
                          : "정보 없음"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlaceClick(place);
                    }}
                    className="place-item-button"
                  >
                    경로 안내
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

// 필터 그룹 컴포넌트
const FilterGroup = ({ title, options, selectedOption, onOptionChange }) => (
  <div className="filter-group">
    <h4 className="filter-title">{title}</h4>
    <div className="filter-checkbox-group">
      <div className="filter-column">
        {options.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              name={title}
              value={option}
              checked={selectedOption === option}
              onChange={() => onOptionChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  </div>
);

export default PlaceList;
