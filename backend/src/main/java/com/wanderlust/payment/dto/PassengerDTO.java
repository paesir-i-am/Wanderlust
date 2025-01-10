package com.wanderlust.payment.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PassengerDTO {
    private String nameEnglish;        // 동승자 영문 이름
    private LocalDate birthDate;       // 동승자 생년월일
    private String gender;             // 동승자 성별
    private String passportNumber;     // 여권 번호
    private LocalDate passportExpiryDate; // 여권 만료일
    private String nationality;        // 동승자 국적
}
