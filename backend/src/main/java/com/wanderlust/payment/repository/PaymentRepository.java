package com.wanderlust.payment.repository;

import com.wanderlust.payment.entity.Payment;
import com.wanderlust.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * 특정 결제 상태 업데이트
     */
    @Modifying
    @Query("UPDATE Payment p SET p.paymentStatus = :status WHERE p.impUid = :impUid")
    void updateStatusByImpUid(@Param("status") PaymentStatus status, @Param("impUid") String impUid);

    /**
     * 특정 결제 상태로 조회
     */
    List<Payment> findByPaymentStatus(PaymentStatus status);

    /**
     * impUid로 결제 조회
     */
    Optional<Payment> findByImpUid(String impUid);
}
