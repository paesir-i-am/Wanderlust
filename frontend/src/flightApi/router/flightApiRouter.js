import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>;
const FlightBoard = lazy(() => import("../components/flightBoard/FlightBoard"));
const ParkingInfo = lazy(() => import("../components/parking/ParkingInfo"));
const ShuttleBus = lazy(() => import("../components/shuttleBus/ShuttleBus"));
const FlightInfoPage = lazy(() => import("../page/FlightInfoPage"));
const ParkingInfoPage = lazy(() => import("../page/ParkingInfoPage"));


const flightApiRouter = () => {
  return [
    {
      path: "flight-board",
      element: (
        <Suspense fallback={Loading}>
          <FlightBoard />
        </Suspense>
      ),
    },
    {
      path: "parking-info",
      element: (
        <Suspense fallback={Loading}>
          <ParkingInfo />
        </Suspense>
      ),
    },
    {
      path: "shuttlebus-info",
      element: (
        <Suspense fallback={Loading}>
          <ShuttleBus />
        </Suspense>
      ),
    },
    {
      path: "flight-info",
      element: (
        <Suspense fallback={Loading}>
          <div className="flight-and-parking-info">
            {/* FlightInfoPage와 ParkingInfoPage 두 컴포넌트를 동시에 렌더링 */}
            <div className="flight-info-container">
              <FlightInfoPage />
            </div>
            <div className="parking-info-container">
              <ParkingInfoPage />
            </div>
          </div>
        </Suspense>
      ),
    },
  ];
};

export default flightApiRouter;
