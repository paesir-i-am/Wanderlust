package com.wanderlust.payment.entity;

public enum PaymentStatus {
    SUCCESS, //결제 성공
    REFUND_REQUESTED,   // 환불 요청
    REFUNDED //환불
}
