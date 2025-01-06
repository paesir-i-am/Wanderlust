import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom"; // useNavigate 대신 Link import
import "../scss/t_list/TourList.scss";
import { FiStar, FiMapPin } from "react-icons/fi";
import { tourListApi } from "../../api/tourListApi";
import { useDispatch, useSelector } from "react-redux";
import { tourListLikeApi } from "../../api/tourListLikeApi";
import { setLikedTotalItems, setLikedTours } from "../../slice/tourListSlice";

const TourList = ({ selectedCountry = null, selectedCities = [] }) => {
  const dispatch = useDispatch();
  const [displayedList, setDisplayedList] = useState([]);

  const likedTours = useSelector((state) => state.list?.likedTours || []);
  const userId = "testUser";

  console.log("TourList likedTours:", likedTours);

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

  const handleLike = async (tourId) => {
    try {
      const response = await tourListLikeApi.likeTour(userId, tourId);

      if (response === "이미 좋아요에 추가한 여행지입니다.") {
        alert("이미 좋아요에 등록된 여행지 입니다.");
      } else {
        const updatedLikes = await tourListLikeApi.getLikedTours(userId);
        const sortedLikes = [...updatedLikes].reverse();
        dispatch(setLikedTours(sortedLikes));
        dispatch(setLikedTotalItems(sortedLikes.length));
        alert("여행지가 좋아요에 추가되었습니다.");
      }
    } catch (error) {
      if (error.response?.data === "이미 좋아요에 추가한 여행지입니다.") {
        alert("이미 좋아요에 등록된 여행지 입니다.");
      } else {
        console.error("Failed to like tour:", error);
        alert("좋아요 처리 중 오류가 발생했습니다.");
      }
    }
  };

  const isLiked = (tourId) => likedTours.some((tour) => tour.tourId === tourId);

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
              <button
                className={`like-button ${isLiked(item.tourId) ? "liked" : ""}`}
                onClick={() => handleLike(item.tourId)}
              >
                <FiStar className="star-icon" />
                <span>좋아요</span>
              </button>
              <Link
                to={`/tour/read/${item.tourId}`}
                state={{ selectedTour: item }}
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
