import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "../../slice/loginSlice";
import { removeCookie } from "../../../common/util/cookieUtil";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // 상태 초기화 및 쿠키 제거
    dispatch(logout());
    removeCookie("member");
    removeCookie("accessToken");
    removeCookie("refreshToken");

    // 홈 페이지로 리다이렉트
    navigate("/");
    window.location.reload();
  }, [dispatch, navigate]);

  return <div>로그아웃 중입니다...</div>;
};

export default LogoutPage;
