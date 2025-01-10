package com.wanderlust.payment.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PaymentResponseDTO {

    // 예약자 정보
    private String reservatorName;         // 예약자 이름
    private String reservatorPhone;        // 예약자 휴대폰 번호

    // 탑승자 정보
    private String passengerNameEnglish;   // 탑승자 영문 이름
    private LocalDate passengerBirthDate;  // 탑승자 생년월일
    private String passengerGender;        // 탑승자 성별
    private String passportNumber;         // 여권 번호
    private LocalDate passportExpiryDate;  // 여권 만료일
    private String nationality;            // 탑승자 국적

    // 결제 정보
    private String impUid;                 // 포트원 결제 고유 번호
    private String merchantUid;            // 주문 번호
    private int amount;                    // 결제 금액
    private String currency;               // 통화 단위
    private String paymentMethod;          // 결제 수단
    private String paymentStatus;          // 결제 상태
    private LocalDate paymentDate;         // 결제 발생 시간

    // 동승자 정보
    private List<PassengerDTO> companions; // 동승자 정보
}
