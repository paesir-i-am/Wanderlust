import axios from "axios";

export const getKakaoLoginLink = () => {
  return `/oauth2/authorization/kakao`;
};

export const fetchMemberInfo = async (accessToken) => {
  try {
    const response = await axios.get("/member/info", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
