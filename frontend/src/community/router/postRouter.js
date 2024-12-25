import { lazy, Suspense } from "react";

const PostListPage = lazy(() => import("../pages/PostListPage"));

const postRouter = () => [
  {
    path: "posts",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PostListPage />
      </Suspense>
    ),
  },
];

export default postRouter;
