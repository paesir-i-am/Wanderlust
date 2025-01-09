import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/payments";

/**
 * 결제 요청 처리
 * @param {Object} params - 결제 요청 데이터
 * @param {string} params.impUid - 결제 고유 ID
 * @param {string} params.merchantUid - 주문 고유 ID
 * @param {number} params.amount - 결제 금액
 * @param {string} params.reservatorName - 예약자 이름
 * @param {string} params.reservatorEmail - 예약자 이메일 주소
 * @param {string} params.reservatorPhone - 예약자 휴대폰 번호
 * @param {string} params.passengerNameEnglish - 탑승자 영문 이름
 * @param {string} params.passengerBirthDate - 탑승자 생년월일
 * @param {string} params.passengerGender - 탑승자 성별
 * @param {string} params.passportNumber - 여권 번호
 * @param {string} params.passportExpiryDate - 여권 만료일
 * @param {string} params.nationality - 탑승자 국적
 * @param {Array<Object>} params.companions - 동승자 정보
 * @returns {Promise<Object>} - 결제 처리 결과
 */
export const processPayment = async ({
  impUid,
  merchantUid,
  amount,
  reservatorName,
  reservatorEmail,
  reservatorPhone,
  passengerNameEnglish,
  passengerBirthDate,
  passengerGender,
  passportNumber,
  passportExpiryDate,
  nationality,
  companions,
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/process`,
      {
        impUid,
        merchantUid,
        amount,
        reservatorName,
        reservatorEmail,
        reservatorPhone,
        passengerNameEnglish,
        passengerBirthDate,
        passengerGender,
        passportNumber,
        passportExpiryDate,
        nationality,
        companions,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("결제 요청 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("결제 요청 실패:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 결제 내역 조회
 * @returns {Promise<Array>} - 결제 내역 목록
 */
export const fetchPaymentHistory = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/history`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    console.log("결제 내역 조회 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "결제 내역 조회 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * 결제 취소 요청
 * @param {string} impUid - 결제 고유 ID
 * @returns {Promise<Object>} - 취소 요청 결과
 */
export const requestCancelPayment = async (impUid) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/cancel/request`,
      { impUid }, // 요청 본문으로 전달
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    console.log("결제 취소 요청 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "결제 취소 요청 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * 결제 취소 요청 목록 조회
 * @returns {Promise<Array>} - 취소 요청 목록
 */
export const fetchCancelRequests = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/admin/cancel/requests`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    console.log("취소 요청 목록 조회 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "취소 요청 목록 조회 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * 취소 요청 승인/거부 처리
 * @param {string} impUid - 결제 고유 ID
 * @param {boolean} approve - 승인 여부
 * @returns {Promise<Object>} - 처리 결과
 */
export const handleApproval = async (impUid, approve) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/cancel/approve`,
      { impUid, approve }, // 요청 본문으로 전달
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    console.log("취소 요청 처리 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "취소 요청 처리 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};
