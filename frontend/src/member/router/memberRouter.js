import { Suspense, lazy } from "react";
const Loading = <div>Loading....</div>;
const Login = lazy(() => import("../pages/login/LoginPage"));


const memberRouter = () => {
	return [
		{
			path: "login",
			element: (
					<Suspense fallback={Loading}>
						<Login />
					</Suspense>
			),
		},
		{
			path: "logout",
			element: (
					<Suspense fallback={Loading}>
						<LogoutPage />
					</Suspense>
			),
		},
		{
			path: "kakao",
			element: (
					<Suspense fallback={Loading}>
						<KakaoRedirect />
					</Suspense>
			),
		},

		{
			path: "modify",
			element: (
					<Suspense fallback={Loading}>
						<MemberModify />
					</Suspense>
			),
		},
	];
};

export default memberRouter;
