import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import MainPage from "../../main/pages/MainPage";
import memberRouter from "../../member/router/memberRouter";
import postRouter from "../../community/router/postRouter";

const Loading = <div>Loading...</div>;

const root = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={Loading}>
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
    children: postRouter(),
  },
]);

export default root;
