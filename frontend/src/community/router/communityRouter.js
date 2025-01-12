import { lazy, Suspense } from "react";

const CommunityPage = lazy(() => import("../pages/CommunityPage"));
const PostListPage = lazy(() => import("../pages/PostListPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));

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
      {
        path: "profile/:nickname",
        element: (
          <Suspense fallback={<div>Loading Profile...</div>}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },
];

export default communityRouter;
