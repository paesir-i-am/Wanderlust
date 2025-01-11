import React, { useEffect, useState } from "react";
import BasicLayout from "../../common/layout/basicLayout/BasicLayout";
import { Link, useNavigate } from "react-router-dom";
import "../../flightApi/components/scss/AirportApi.scss";
import { tourListApi } from "../../tour/api/tourListApi";
import { fetchPosts } from "../../community/api/postApi";
import "./mainPage.scss";

const MainPage = () => {
  const [tourList, setTourList] = useState([]);
  const [postList, setPostList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTourList = async () => {
      try {
        const data = await tourListApi.getRandomTourList(3);
        setTourList(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchPostList = async () => {
      try {
        const { content } = await fetchPosts(0, 3);
        setPostList(content);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostList();
    fetchTourList();
  }, []);

  return (
    <BasicLayout>
      <div className="main-page">
        {/*항공 정보 api 컨텐츠*/}
        <div className="additional-contents">
          <Link to="/flightApi/flight-board" className="link-styles">
            <div className="flightBoard-banner">
              <p>항공편 상세조회</p>
              <p className="english-text">Flight Information</p>
              <img src="/icons/airplaneLogo.png" alt="Airplane Logo" />
            </div>
          </Link>
          <Link to="/flightApi/parking-info" className="link-styles">
            <div className="parking-banner">
              <p>주차장</p>
              <p className="english-text">Parking Lot</p>
              <img src="/icons/parkingLogo.png" alt="Parking Logo" />
            </div>
          </Link>
          <Link to="/flightApi/shuttlebus-info" className="link-styles">
            <div className="shuttlebus-banner">
              <p>셔틀버스</p>
              <p className="english-text">Shuttle Bus</p>
              <img src="/icons/shuttlebusLogo.png" alt="Shuttlebus Logo" />
            </div>
          </Link>
        </div>

        {/*랜덤 추천 여행지*/}
        <section className="random-tour-section">
          <h2>여행지 추천</h2>
          <div className="grid-container">
            {tourList.map((tour) => (
              <div key={tour.tourId} className="card">
                <img
                  src={`http://localhost:8080${tour.cityImg}`}
                  alt={tour.cityName}
                />
                <div className="card-content">
                  <h2>{tour.cityName}</h2>
                  <h3>{tour.tourTitle}</h3>
                  <p>
                    {tour.tourContext.length > 40
                      ? `${tour.tourContext.slice(0, 40)}...`
                      : tour.tourContext}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/tour/list")} className="more-btn">
            >
          </button>
        </section>

        {/* 최신 포스트 리스트 */}
        <section className="latest-post-section">
          <h2>커뮤니티</h2>
          <div className="grid-container">
            {postList.map((post) => {
              const imageUrl = post.imageUrl
                ? `http://localhost:8080${post.imageUrl}`
                : "null"; // 기본 이미지 URL 추가
              const formatDate = (date) => {
                const options = {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                };
                return new Date(date).toLocaleDateString("ko-KR", options);
              };

              return (
                <div key={post.id} className="post">
                  <img
                    className="post__background"
                    src={imageUrl}
                    alt="Post Background"
                  />
                  <div className="post__content">
                    <h3 className="post__nickname">{post.authorNickname}</h3>
                    <span className="post__date">
                      {formatDate(post.createdAt)}
                    </span>
                    <p className="post__text">
                      {post.content.length > 10
                        ? `${post.content.slice(0, 10)}...`
                        : post.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => navigate("/community")} className="more-btn">
            >
          </button>
        </section>
      </div>
    </BasicLayout>
  );
};

export default MainPage;
