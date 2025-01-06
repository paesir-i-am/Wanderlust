import axios from "axios";
import { API_SERVER_HOST } from "../../common/api/mainApi";
import jwtAxios from "../../common/util/jwtUtil";

const host = `${API_SERVER_HOST}/member`;

export const loginPost = async (loginParam) => {
  const header = { headers: { "Content-Type": "x-www-form-urlencoded" } };

  const form = new FormData();
  form.append("email", loginParam.email);
  form.append("pw", loginParam.pw);

  const res = await axios.post(`${host}/login`, form, header);

  return res.data;
};

export const registerPost = async (registerParam) => {
  const header = { headers: { "Content-Type": "application/json" } };

  const res = await axios.post(`${host}/register`, registerParam, header);

  return res.data;
};

export const checkEmailDuplicate = async (email) => {
  try {
    const res = await axios.get(`${host}/checkEmail`, { params: { email } });
    return res.data;
  } catch (err) {
    console.log("이메일 중복 체크 실패 : " + err);
    throw err;
  }
};

export const checkNicknameDuplicate = async (nickname) => {
  try {
    const res = await axios.get(`${host}/checkNickname`, {
      params: { nickname },
    });
    return res.data;
  } catch (err) {
    console.log("닉네임 중복 체크 실패 : " + err);
    throw err;
  }
};

export const modifyMember = async (member) => {
  const res = await jwtAxios.put(`${host}/modify`, member);

  return res.data;
};
