import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import MainPage from "../../main/pages/MainPage";
import memberRouter from "../../member/router/memberRouter";
import communityRouter from "../../community/router/communityRouter";
import FlightSearch from "../../flight/components/FlightSearch"; // FlightSearch 컴포넌트
import FlightList from "../../flight/components/FlightList";
import tourListRouter from "../../tour/router/tourListRouter";
import flightApiRouter from "../../flightApi/router/flightApiRouter"; // flightApiRouter 가져오기
import AirInfoPage from "../../flightApi/page/main/AirInfoPage";
import PaymentPage from "../../payment/components/PaymentPage"; // PaymentPage 컴포넌트

const Loading = () => <div>Loading...</div>;

const root = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <MainPage />
      </Suspense>
    ),
  },

  {
    path: "member",
    children: memberRouter(),
  },

  {
    path: "community",
    children: communityRouter(),
  },

  {
    path: "flightApi",
    children: flightApiRouter(),
  },

  {
    path: "/flight", // Flight 관련 경로 추가
    children: [
      {
        path: "", // /flight 경로
        element: (
          <Suspense fallback={<Loading />}>
            <FlightSearch />
          </Suspense>
        ),
      },
      {
        path: "result", // /flight/result 경로
        element: (
          <Suspense fallback={<Loading />}>
            <FlightList />
          </Suspense>
        ),
      },
    ],
  },

  {
    path: "tour",
    children: tourListRouter(),
  },

  {
    path: "/flight-info", // /flight-info 경로 설정
    element: (
      <Suspense fallback={Loading}>
        <AirInfoPage />
      </Suspense>
    ),
  },

  {
    path: "payment", // /payment 경로
    element: (
      <Suspense fallback={<Loading />}>
        <PaymentPage />
      </Suspense>
    ),
  },
]);

export default root;
