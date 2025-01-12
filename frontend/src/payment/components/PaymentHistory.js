import React, { useState, useEffect } from "react";
import BasicLayoutWithoutFlight from "../../common/layout/basicLayout/BasicLayoutWithoutFlight";
import { getCookie } from "../../common/util/cookieUtil";
import { fetchPaymentsByEmail } from "../api/paymentApi";
import axios from "axios";
import "../styles/PaymentHistory.scss";
import useCustomLogin from "../../member/hook/useCustomLogin";
import { useSelector } from "react-redux";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const { isLogin, doLoginPopup } = useCustomLogin();

  const email = useSelector((state) => state.loginSlice.email);

  useEffect(() => {
    if (!isLogin) {
      doLoginPopup();
      return;
    }
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentData = await fetchPaymentsByEmail(email);
        if (paymentData && paymentData.length > 0) {
          setPayments(paymentData);
          setSelectedPayment(paymentData[0]);
        } else {
          setPayments([]);
        }
      } catch (err) {
        setError("결제 내역을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchPayments();
    } else {
      setError("이메일 정보가 없습니다.");
      setLoading(false);
    }
  }, [email]);

  const handleRefund = async (impUid) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8080/api/payments/refund/request`,
        { impUid },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("환불 요청 성공:", response.data);
      alert("환불 요청이 성공적으로 처리되었습니다.");

      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.merchantUid === impUid
            ? { ...payment, paymentStatus: "REFUND_REQUESTED" }
            : payment,
        ),
      );

      if (selectedPayment?.merchantUid === impUid) {
        setSelectedPayment((prevSelected) => ({
          ...prevSelected,
          paymentStatus: "REFUND_REQUESTED",
        }));
      }

      const portoneAdminUrl = `https://admin.iamport.kr/payments/환불?imp_uid=${impUid}`;
      window.open(portoneAdminUrl, "_blank");
    } catch (error) {
      console.error("환불 요청 실패:", error.response?.data || error.message);
      alert("환불 요청 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (loading) return <div>결제 내역을 불러오는 중...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <BasicLayoutWithoutFlight>
      <div className="payment-history-container">
        <div className="user-info">
          <h3>회원 이메일: {email}</h3>
        </div>

        <div className="content-wrapper">
          <aside className="payment-list">
            <header>
              <h2>결제 내역</h2>
            </header>
            <ul>
              {payments.map((payment) => (
                <li
                  key={payment.merchantUid}
                  className={
                    selectedPayment?.merchantUid === payment.merchantUid
                      ? "active"
                      : ""
                  }
                  onClick={() => setSelectedPayment(payment)}
                >
                  <span>{payment.merchantUid}</span>
                  <span>{payment.paymentDate}</span>
                  <span>{payment.amount.toLocaleString()}원</span>
                  <span>{payment.paymentStatus}</span>
                </li>
              ))}
            </ul>
          </aside>

          <section className="payment-details">
            {selectedPayment ? (
              <>
                <header>
                  <h2>결제 상세 정보</h2>
                </header>
                <div className="detail-item">
                  <label>결제 번호:</label>
                  <span>{selectedPayment.merchantUid}</span>
                </div>
                <div className="detail-item">
                  <label>결제 날짜:</label>
                  <span>{selectedPayment.paymentDate}</span>
                </div>
                <div className="detail-item">
                  <label>예약자명:</label>
                  <span>{selectedPayment.reservatorName}</span>
                </div>
                <div className="detail-item">
                  <label>탑승자명:</label>
                  <span>{selectedPayment.passengerNameEnglish}</span>
                </div>
                {selectedPayment.companions?.length > 0 && (
                  <div className="detail-item">
                    <label>동승자명:</label>
                    <span>
                      {selectedPayment.companions
                        .map((c) => c.nameEnglish)
                        .join(", ")}
                    </span>
                  </div>
                )}
                <div className="detail-item">
                  <label>예약 금액:</label>
                  <span>{selectedPayment.amount.toLocaleString()}원</span>
                </div>
                <div className="detail-item">
                  <label>결제 상태:</label>
                  <span>{selectedPayment.paymentStatus}</span>
                </div>
                {selectedPayment.paymentStatus !== "환불 요청 완료" && (
                  <button
                    className="refund-button"
                    onClick={() => handleRefund(selectedPayment.merchantUid)}
                  >
                    환불 요청
                  </button>
                )}
              </>
            ) : (
              <p>결제 내역을 선택하세요.</p>
            )}
          </section>
        </div>
      </div>
    </BasicLayoutWithoutFlight>
  );
};

export default PaymentHistory;
