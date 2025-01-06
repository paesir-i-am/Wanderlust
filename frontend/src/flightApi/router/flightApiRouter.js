import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>;
const FlightBoard = lazy(() => import("../components/flightBoard/FlightBoard"));
const ParkingInfo = lazy(() => import("../components/parking/ParkingInfo"));
const ShuttleBus = lazy(() => import("../components/shuttleBus/ShuttleBus"));

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
  ];
};

export default flightApiRouter;
