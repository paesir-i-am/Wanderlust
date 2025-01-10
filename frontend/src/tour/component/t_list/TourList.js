import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../scss/t_list/TourList.scss";
import { FiMapPin } from "react-icons/fi";
import { tourListApi } from "../../api/tourListApi";

const TourList = ({ selectedCountry = null, selectedCities = [] }) => {
  const [displayedList, setDisplayedList] = useState([]);

  const selectedCityNames = useMemo(
    () => selectedCities?.map((city) => city.cityName) || [],
    [selectedCities],
  );

  useEffect(() => {
    const fetchTourList = async () => {
      try {
        const response = await tourListApi.getFilteredTourList(
          selectedCountry?.countryName || null,
          selectedCityNames,
        );
        console.log("Fetched tour list response:", response);
        setDisplayedList(response);
      } catch (error) {
        console.error("Failed to fetch tour list:", error);
      }
    };

    if (selectedCountry) {
      fetchTourList();
    }
  }, [selectedCountry, selectedCityNames]);

  return (
    <div className="list-container">
      <div className="header">
        {Array.isArray(displayedList) && displayedList.length > 0
          ? `총 ${displayedList.length}개의 여행지가 있습니다`
          : "여행지가 없습니다"}
      </div>
      {Array.isArray(displayedList) &&
        displayedList.map((item, index) => (
          <div
            key={item.tourId || `${item.cityName}-${index}`}
            className="list-item"
          >
            <div className="image-box">
              <img
                src={item.cityImg}
                alt={item.cityName}
                onError={(e) => {
                  console.error("Image loading failed:", item.cityImg);
                  e.target.src = "/fallback-image.jpg"; // 대체 이미지 설정
                }}
              />
            </div>
            <div className="content-box">
              <h3 className="title">{item.tourTitle}</h3>
              <p className="location">
                <FiMapPin className="map-pin-icon" /> {item.cityName}
              </p>
              <p className="tour-context">{item.tourContext}</p>
            </div>
            <div className="action-box">
              <Link
                to={`/tour/read/${item.tourId}`}
                state={{
                  selectedTour: item,
                  tourId: item.tourId, // tourId 추가
                }}
                className="detail-button"
              >
                상세 정보
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default TourList;
