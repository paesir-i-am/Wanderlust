import React, { useEffect, useState } from "react";
import { tourListApi } from "../../api/tourListApi";
import "../scss/t_list/Random.scss";

const Random = ({ count = 3 }) => {
  const [randomTours, setRandomTours] = useState([]);

  useEffect(() => {
    const fetchRandomTours = async () => {
      try {
        const tours = await tourListApi.getRandomTourList(count);
        setRandomTours(tours);
      } catch (error) {
        console.error("Error fetching random tours:", error);
      }
    };

    fetchRandomTours();
  }, [count]);

  return (
    <div className="random-tours-container">
      <h2>취향에 맞는 여행지를 추천합니다❤️</h2>
      <div className="random-tours-grid">
        {randomTours.map((tour) => (
          <div key={tour.tourId} className="random-tour-item">
            <img
              src={`http://localhost:8080${tour.cityImg}`}
              alt={tour.cityName}
            />
            <h3>{tour.tourTitle}</h3>
            <p>{tour.cityName}</p>
            <p>{tour.tourContext}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Random;
