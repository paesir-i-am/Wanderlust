package com.wanderlust.payment.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentHistoryDTO {

    private String impUid;         // 포트원 결제 고유 번호
    private String merchantUid;    // 주문 번호
    private int amount;            // 총 결제 금액
    private String paymentStatus;  // 결제 상태
    private LocalDateTime paymentDate; // 결제 날짜

    public PaymentHistoryDTO(String impUid, String merchantUid, int amount, String paymentStatus, LocalDateTime paymentDate) {
        this.impUid = impUid;
        this.merchantUid = merchantUid;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.paymentDate = paymentDate;
    }
}
