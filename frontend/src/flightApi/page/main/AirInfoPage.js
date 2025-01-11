// AirInfoPage.js
import React from "react";
import FlightInfoPage from "../FlightInfoPage";
import ParkingInfoPage from "../ParkingInfoPage";
import ShuttleBusInfoPage from "../ShuttleBusInfoPage";
import BasicLayout from "../../../common/layout/basicLayout/BasicLayout";
import "../scss/AirInfoPage.css";

const AirInfoPage = () => {
  return (
    <BasicLayout>
      <div className="air-info-page">
        <section className="flights-info-section air-info-section">
          <FlightInfoPage />
        </section>
        <section className="parking-info-section air-info-section">
          <ParkingInfoPage />
        </section>
        <section className="shuttle-info-section air-info-section">
          <ShuttleBusInfoPage />
        </section>
      </div>
    </BasicLayout>
  );
};

export default AirInfoPage;
