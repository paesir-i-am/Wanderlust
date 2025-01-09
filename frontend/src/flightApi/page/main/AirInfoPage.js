// AirInfoPage.js
import React from 'react';
import FlightInfoPage from '../FlightInfoPage';
import ParkingInfoPage from '../ParkingInfoPage';
import ShuttleBusInfoPage from '../ShuttleBusInfoPage';
import BasicLayout from '../../../common/layout/basicLayout/BasicLayout'; // 필요에 따라 기본 레이아웃을 추가

const AirInfoPage = () => {
  return (
    <BasicLayout>
      <div className="air-info-page">
        <section className="flight-info-section">
          <FlightInfoPage />
        </section>
        <section className="parking-info-section">
          <ParkingInfoPage />
        </section>
        <section className="shuttle-info-section">
          <ShuttleBusInfoPage />
        </section>
      </div>
    </BasicLayout>
  );
};

export default AirInfoPage;
