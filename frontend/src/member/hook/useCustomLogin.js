import { useNavigate, Navigate, createSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import loginSlice, {
  loginPostAsync,
  logout,
  loginSuccess,
  registerPostAsync,
} from "../slice/loginSlice";
import { setCookie, getCookie } from "../../common/util/cookieUtil";
import { useEffect } from "react";

export const useCustomLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.loginSlice);

  // 새로고침 시 쿠키에서 로그인 상태 복원
  useEffect(() => {
    const member = getCookie("member");
    if (member?.accessToken) {
      dispatch(loginSuccess(member)); // Redux 상태 초기화
    }
  }, [dispatch]);

  const isLogin = Boolean(
    loginSlice.accessToken || getCookie("member")?.accessToken,
  );

  // 팝업 창 관리
  const openPopup = (
    url,
    windowName = "PopupWindow",
    width = 1000,
    height = 600,
  ) => {
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      url,
      windowName,
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`,
    );

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      alert("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
    }
    return popup;
  };

  const doLoginPopup = () => {
    const popup = openPopup("/member/login", "LoginPopup");
    const popupInterval = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(popupInterval);
        console.log("팝업 창이 닫혔습니다.");
        window.location.reload(); // 새로고침
      }
    }, 500);
  };

  // 로그인 함수
  const doLogin = async (loginParam) => {
    try {
      const action = await dispatch(loginPostAsync(loginParam));
      const responseData = action.payload;

      if (responseData.accessToken && responseData.refreshToken) {
        // 쿠키에 저장
        setCookie("member", responseData, { maxAge: 86400 });
        // Redux 상태 업데이트
        dispatch(loginSuccess(responseData));
        console.log("로그인 성공, 토큰이 저장되었습니다.");
        return responseData;
      } else {
        throw new Error("로그인 응답에 토큰이 없습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      } else {
        alert("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
      throw error;
    }
  };

  // 로그아웃 함수
  const doLogout = () => {
    navigate("/member/logout");
  };

  // 회원가입 함수
  const doRegister = async (registerParam) => {
    try {
      const action = await dispatch(registerPostAsync(registerParam));
      const responseData = action.payload;

      if (responseData) {
        console.log("회원가입 성공 : " + responseData);
        window.location.reload();
        return responseData;
      } else {
        throw new Error("회원가입 응답이 비어있습니다");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        console.log("401 Error");
        throw error;
      }
    }
  };

  // 페이지 이동
  const moveToPath = (path) => {
    navigate({ pathname: path }, { replace: true });
  };

  // 로그인 페이지로 이동
  const moveToLogin = () => {
    navigate({ pathname: "/member/login" }, { replace: true });
  };

  // 로그인 페이지로 이동하는 컴포넌트 반환
  const moveToLoginReturn = () => {
    return <Navigate replace to="/member/login" />;
  };

  // 예외 처리
  const exceptionHandle = (ex) => {
    console.log("Exception----------------------");
    console.log(ex);

    const errorMsg = ex.response?.data?.error;
    const errorStr = createSearchParams({ error: errorMsg }).toString();

    if (errorMsg === "REQUIRE_LOGIN") {
      alert("로그인 해야만 합니다.");
      navigate({ pathname: "/member/login", search: errorStr });
    } else if (errorMsg === "ERROR_ACCESSDENIED") {
      alert("해당 메뉴를 사용할 수 있는 권한이 없습니다.");
      navigate({ pathname: "/member/login", search: errorStr });
    } else {
      alert("알 수 없는 오류가 발생했습니다.");
    }
  };

  return {
    loginState,
    isLogin,
    doLogin,
    doLogout,
    doRegister,
    doLoginPopup,
    moveToPath,
    moveToLogin,
    moveToLoginReturn,
    exceptionHandle,
  };
};

export default useCustomLogin;
