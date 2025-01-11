import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { processPayment } from "../api/paymentapi";
import "../styles/PaymentPage.scss";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const totalPrice = location.state?.totalPrice || 0; // 총 결제 금액

  // FlightList에서 전달된 탑승자 정보
  const passengers = location.state?.passengers || {
    adults: 1,
    children: 0,
    infants: 0,
  };

  // 예약자 정보 상태
  const [reservatorName, setReservatorName] = useState("");
  const [reservatorEmail, setReservatorEmail] = useState("");
  const [reservatorPhone, setReservatorPhone] = useState("");

  // 탑승자 정보 상태
  const [passengerNameEnglish, setPassengerNameEnglish] = useState("");
  const [passengerBirthDate, setPassengerBirthDate] = useState("");
  const [passengerGender, setPassengerGender] = useState("M");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpiryDate, setPassportExpiryDate] = useState("");
  const [nationality, setNationality] = useState("");

  // 동승자 정보 상태
  const [companions, setCompanions] = useState([]);

  // 동승자 정보 초기화
  useEffect(() => {
    const { adults, children, infants } = passengers;

    // 동승자는 예약자 1명을 제외한 나머지 인원
    const totalCompanions = adults + children + infants - 1;

    if (totalCompanions > 0) {
      const initialCompanions = Array.from(
        { length: totalCompanions },
        (_, i) => ({
          nameEnglish: "",
          birthDate: "",
          gender: "M",
          passportNumber: "",
          passportExpiryDate: "",
          nationality: "",
        }),
      );
      setCompanions(initialCompanions);
    }
  }, [passengers]);

  // 동승자 정보 업데이트
  const updateCompanion = (index, field, value) => {
    setCompanions((prevCompanions) => {
      const updatedCompanions = [...prevCompanions];
      updatedCompanions[index][field] = value;
      return updatedCompanions;
    });
  };

  // 결제 처리
  const handlePayment = async () => {
    if (
      !reservatorName ||
      !reservatorEmail ||
      !reservatorPhone ||
      !passengerNameEnglish ||
      !passengerBirthDate ||
      !passportNumber ||
      !passportExpiryDate ||
      !nationality
    ) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    const merchantUid = `order_${new Date().getTime()}`;

    const IMP = window.IMP;
    IMP.init("imp10303705");

    IMP.request_pay(
      {
        pg: "kakaopay",
        pay_method: "card",
        merchant_uid: merchantUid,
        name: "항공권 결제",
        amount: totalPrice,
        buyer_email: reservatorEmail,
        buyer_name: reservatorName,
        buyer_tel: reservatorPhone,
      },
      async (response) => {
        if (response.success) {
          const { imp_uid: impUid, merchant_uid: merchantUid } = response;

          try {
            await processPayment({
              impUid,
              merchantUid,
              amount: totalPrice,
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
            });

            alert("결제가 성공적으로 완료되었습니다.");
            navigate("/mypage/payment/history", { state: { reservatorEmail } });
          } catch (error) {
            console.error("백엔드 결제 처리 실패:", error);
            alert("결제 처리 중 문제가 발생했습니다.");
          }
        } else {
          console.error("결제 실패:", response.error_msg);
          alert(`결제가 실패했습니다: ${response.error_msg}`);
        }
      },
    );
  };

  return (
    <div className="payment-container">
      <header className="payment-header">
        <h1>항공권 결제</h1>
        <p>총 결제 금액: {totalPrice.toLocaleString()}원</p>
      </header>
      <section className="reservator-info section-info">
        <h2>예약자 정보</h2>
        <div className="form-group">
          <label>예약자 이름:</label>
          <input
            type="text"
            value={reservatorName}
            onChange={(e) => setReservatorName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>예약자 이메일:</label>
          <input
            type="email"
            value={reservatorEmail}
            onChange={(e) => setReservatorEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>예약자 전화번호:</label>
          <input
            type="text"
            value={reservatorPhone}
            onChange={(e) => setReservatorPhone(e.target.value)}
          />
        </div>
      </section>
      <section className="passenger-info section-info">
        <h2>탑승자 정보</h2>
        <div className="form-group">
          <label>탑승자 영문 이름:</label>
          <input
            type="text"
            value={passengerNameEnglish}
            onChange={(e) => setPassengerNameEnglish(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>탑승자 생년월일:</label>
          <input
            type="date"
            value={passengerBirthDate}
            onChange={(e) => setPassengerBirthDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>탑승자 성별:</label>
          <select
            value={passengerGender}
            onChange={(e) => setPassengerGender(e.target.value)}
          >
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </div>
        <div className="form-group">
          <label>여권 번호:</label>
          <input
            type="text"
            value={passportNumber}
            onChange={(e) => setPassportNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>여권 만료일:</label>
          <input
            type="date"
            value={passportExpiryDate}
            onChange={(e) => setPassportExpiryDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>국적:</label>
          <input
            type="text"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
          />
        </div>
      </section>
      {companions.length > 0 && (
        <section className="companions-info section-info">
          <h2>동승자 정보</h2>
          {companions.map((companion, index) => (
            <div key={index} className="companion-card">
              <h3>동승자 {index + 1}</h3>
              <div className="form-group">
                <label>이름:</label>
                <input
                  type="text"
                  value={companion.nameEnglish}
                  onChange={(e) =>
                    updateCompanion(index, "nameEnglish", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>생년월일:</label>
                <input
                  type="date"
                  value={companion.birthDate}
                  onChange={(e) =>
                    updateCompanion(index, "birthDate", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>성별:</label>
                <select
                  value={companion.gender}
                  onChange={(e) =>
                    updateCompanion(index, "gender", e.target.value)
                  }
                >
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              </div>
              <div className="form-group">
                <label>여권 번호:</label>
                <input
                  type="text"
                  value={companion.passportNumber}
                  onChange={(e) =>
                    updateCompanion(index, "passportNumber", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>여권 만료일:</label>
                <input
                  type="date"
                  value={companion.passportExpiryDate}
                  onChange={(e) =>
                    updateCompanion(index, "passportExpiryDate", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>국적:</label>
                <input
                  type="text"
                  value={companion.nationality}
                  onChange={(e) =>
                    updateCompanion(index, "nationality", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </section>
      )}
      <button onClick={handlePayment} className="btn-submit">
        결제 진행
      </button>
    </div>
  );
};

export default PaymentPage;
