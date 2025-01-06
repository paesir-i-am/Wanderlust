import React from "react";
import BasicLayout from "../../common/layout/basicLayout/BasicLayout";
import { Link } from "react-router-dom";
import "../../flightApi/components/scss/AirportApi.scss";

const Home = () => {
  return (
    <BasicLayout>
      <div>
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
              <p>주차장 혼잡도</p>
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
      </div>
    </BasicLayout>
  );
};

export default Home;
