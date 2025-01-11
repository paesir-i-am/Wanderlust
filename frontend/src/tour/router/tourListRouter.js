import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading....</div>;
const TourList = lazy(() => import("../page/TourListPage"));
const TourRead = lazy(() => import("../page/TourReadPage"));

const tourListRouter = () => {
  return [
    {
      path: "list", // 명확하게 "/tour/list"로 매핑
      element: (
        <Suspense fallback={Loading}>
          <TourList />
        </Suspense>
      ),
    },
    {
      path: "read/:tourId", // 경로 파라미터 포함
      element: (
        <Suspense fallback={Loading}>
          <TourRead />
        </Suspense>
      ),
    },
    {
      path: "*",
      element: <Navigate replace to="/tour/list" />, // 잘못된 경로 처리
    },
  ];
};

export default tourListRouter;
