import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>;

// Lazy-loaded components for Post-related pages
const PostListPage = lazy(() => import("../pages/posts/PostListPage"));
const PostItemPage = lazy(() => import("../pages/posts/PostItemPage"));
const PostCreatePage = lazy(() => import("../pages/posts/PostCreatePage"));
const PostEditPage = lazy(() => import("../pages/posts/PostEditPage"));

const postRouter = () => {
  return [
    {
      path: "posts",
      element: (
        <Suspense fallback={Loading}>
          <PostListPage />
        </Suspense>
      ),
    },
    {
      path: "posts/:id",
      element: (
        <Suspense fallback={Loading}>
          <PostItemPage />
        </Suspense>
      ),
    },
    {
      path: "posts/create",
      element: (
        <Suspense fallback={Loading}>
          <PostCreatePage />
        </Suspense>
      ),
    },
    {
      path: "posts/:id/edit",
      element: (
        <Suspense fallback={Loading}>
          <PostEditPage />
        </Suspense>
      ),
    },
  ];
};

export default postRouter;
