import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { kakaoLoginAsync } from "../../slice/loginSlice";

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const authCode = searchParams.get("code"); // 카카오에서 전달된 인증 코드

  useEffect(() => {
    if (authCode) {
      dispatch(kakaoLoginAsync(authCode)); // Redux를 통해 카카오 로그인 처리
    }
  }, [authCode, dispatch]);

  return (
    <div>
      <h1>카카오 로그인 중...</h1>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
};

export default KakaoRedirectPage;
