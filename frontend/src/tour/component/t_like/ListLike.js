import React from "react";
import { tourListLikeApi } from "../../api/tourListLikeApi";
import { useDispatch } from "react-redux";
import { setTotalItems, setTourList } from "../../slice/tourListSlice";
import { FiMapPin, FiStar } from "react-icons/fi";

const ListLike = ({ tourList, selectedCountry, selectedCities, onRefresh }) => {
  const dispatch = useDispatch();
  const userId = "testUser"; // 실제 구현시 사용자 인증 시스템에서 가져오도록 수정 필요

  const handleUnlike = async (tourId) => {
    try {
      await tourListLikeApi.unlikeTour(userId, tourId);
      // 좋아요 삭제 후 목록 새로고침
      const updatedTours = await tourListLikeApi.getLikedTours(userId);
      dispatch(setTourList(updatedTours));
      dispatch(setTotalItems(updatedTours.length));
      if (onRefresh) {
        onRefresh(); // 새로고침 함수 호출
      }
    } catch (error) {
      console.error("Failed to unlike tour:", error);
    }
  };

  const handleDetailClick = (tourId) => {
    // 상세 페이지로 이동하는 로직 구현
    console.log("Viewing details for tour:", tourId);
  };

  const reversedTourList = [...tourList].reverse();

  return (
    <div className="list-container">
      {/* 상단 헤더 부분 */}
      <div className="header">
        {Array.isArray(reversedTourList) && reversedTourList.length > 0
          ? `총 ${reversedTourList.length}개의 여행지가 추가되었습니다`
          : "관심있는 여행지가 없습니다"}
      </div>

      {/* 좋아요 리스트 */}
      {Array.isArray(reversedTourList) &&
        reversedTourList.map((item, index) => (
          <div
            key={item.tourId || `${item.cityName}-${index}`}
            className="list-item"
          >
            {/* 이미지 박스 */}
            <div className="image-box">
              <img src={item.cityImg} alt={item.cityName} />
            </div>

            {/* 컨텐츠 박스 */}
            <div className="content-box">
              <h3 className="title">{item.tourTitle}</h3>
              <p className="location">
                <FiMapPin className="map-pin-icon" /> {item.cityName}
              </p>
              <p className="tour-context">{item.tourContext}</p>
            </div>

            {/* 액션 버튼 박스 */}
            <div className="action-box">
              {/* 좋아요 취소 버튼 */}
              <button
                className="like-button"
                onClick={() => handleUnlike(item.tourId)}
              >
                <FiStar className="star-icon" />
                <span>좋아요</span>
              </button>
              {/* 상세 정보 버튼 */}
              <button
                className="detail-button"
                onClick={() => handleDetailClick(item.tourId)}
              >
                상세 정보
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ListLike;
