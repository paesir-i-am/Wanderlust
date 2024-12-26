import { lazy, Suspense } from "react";

const CommunityPage = lazy(() => import("../pages/CommunityPage"));
const PostListPage = lazy(() => import("../pages/PostListPage"));

const communityRouter = () => [
  {
    path: "",
    element: (
      <Suspense fallback={<div>Loading Community...</div>}>
        <CommunityPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading Post List...</div>}>
            <PostListPage />
          </Suspense>
        ),
      },
    ],
  },
];

export default communityRouter;
