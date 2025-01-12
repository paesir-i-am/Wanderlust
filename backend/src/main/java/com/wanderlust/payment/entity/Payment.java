package com.wanderlust.payment.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wanderlust.member.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 예약자 정보
    private String reservatorName;         // 예약자 이름
    private String reservatorEmail;        // 예약자 이메일 주소
    private String reservatorPhone;        // 예약자 휴대폰 번호


    // 탑승자 정보
    private String passengerNameEnglish;   // 탑승자 영문 이름
    private LocalDate passengerBirthDate;  // 탑승자 생년월일
    private String passengerGender;        // 탑승자 성별
    private String passportNumber;         // 여권 번호
    private LocalDate passportExpiryDate;  // 여권 만료일
    private String nationality;            // 탑승자 국적

    // 결제 정보
    private String impUid;                 // 아임포트 결제 고유 ID
    private String merchantUid;            // 주문 고유 ID
    private int amount;                    // 결제 금액
    private String currency;               // 통화 단위
    private String paymentMethod;          // 결제 수단

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;   // 결제 상태 (열거형)

    private LocalDate paymentDate;         // 결제 발생 시간


    // Member와의 연관 관계
    @ManyToOne
    @JoinColumn(name = "member_email", referencedColumnName = "email")
    @JsonIgnore
    private Member member; // Member와 매핑

    // 동승자 정보 (JSON 타입으로 저장)
    @Lob
    @Column(columnDefinition = "LONGTEXT") // MySQL에서 LONGTEXT로 명시적으로 선언
    @Convert(converter = JsonConverter.class)
    private List<Passenger> companions;

    @Data
    @NoArgsConstructor
    public static class Passenger {
        private String nameEnglish;        // 동승자 영문 이름
        private LocalDate birthDate;       // 동승자 생년월일
        private String gender;             // 동승자 성별
        private String passportNumber;     // 여권 번호
        private LocalDate passportExpiryDate; // 여권 만료일
        private String nationality;        // 동승자 국적
    }
}
