import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAccessToken, getMemberWithAccessToken } from "../../api/kakaoApi";
import { useDispatch } from "react-redux";
import { login } from "../../slice/loginSlice";
import useCustomLogin from "../../hook/useCustomLogin";

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams();

  const { moveToPath } = useCustomLogin();

  const dispatch = useDispatch();

  // 인가코드 받기위한 변수
  const authCode = searchParams.get("code");

  useEffect(() => {
    getAccessToken(authCode)
      .then((accessToken) => {
        console.log(accessToken);

        // back에서 사용자 정보를 받아와서 memberInfo로 전달.
        getMemberWithAccessToken(accessToken).then((memberInfo) => {
          console.log("------------------");
          console.log(memberInfo);

          dispatch(login(memberInfo));

          alert("로그인 성공! 환영합니다" + memberInfo.nickname + "님");
          window.close();
        });
      })
      .catch((err) => {
        console.log(err);
        alert("로그인 중 오류가 발생하였습니다");
      });
  }, [authCode]);
  return (
    <div>
      <div>Kakao Login Redirect</div>
      <div>{authCode}</div>
    </div>
  );
};

export default KakaoRedirectPage;
