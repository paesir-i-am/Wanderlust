package com.wanderlust.payment.controller;

import com.wanderlust.payment.dto.PaymentRequestDTO;
import com.wanderlust.payment.entity.Payment;
import com.wanderlust.payment.service.PaymentService;
import com.wanderlust.payment.service.PortoneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final PortoneService portoneService;

    /**
     * 결제 요청 처리 (React → 서버)
     */
    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequestDTO paymentRequest) {
        try {
            log.info("결제 요청 수신: {}", paymentRequest);

            // 필수 필드 검증
            if (paymentRequest.getImpUid() == null || paymentRequest.getMerchantUid() == null || paymentRequest.getAmount() <= 0) {
                log.error("결제 요청 실패: 필수 필드 누락");
                return ResponseEntity.badRequest().body("유효하지 않은 결제 요청입니다. 필수 필드를 확인하세요.");
            }

            // 결제 요청 처리
            paymentService.processPayment(paymentRequest);

            log.info("결제 요청 처리 완료: {}", paymentRequest);
            return ResponseEntity.ok("결제가 성공적으로 처리되었습니다.");
        } catch (Exception e) {
            log.error("결제 처리 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("결제 처리 실패: " + e.getMessage());
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validatePayment(@RequestParam String impUid, @RequestParam int amount) {
        try {
            log.info("결제 검증 요청: impUid={}, amount={}", impUid, amount);

            // PortOne 인증 토큰 가져오기
            String token = portoneService.getAccessToken();
            log.info("PortOne 인증 토큰 발급 성공: {}", token);

            // PortOne API를 통해 결제 검증
            portoneService.validatePayment(impUid, amount, token);
            log.info("PortOne 결제 검증 성공: impUid={}, amount={}", impUid, amount);

            // 검증 후 결제 상태 업데이트
            paymentService.updatePaymentStatusToCompleted(impUid);
            log.info("결제 상태 업데이트 완료: impUid={}", impUid);

            return ResponseEntity.ok("결제가 성공적으로 검증되었습니다.");
        } catch (Exception e) {
            log.error("결제 검증 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("결제 검증 실패: " + e.getMessage());
        }
    }

    @GetMapping("/member/{email}")
    public ResponseEntity<?> getPaymentsByNickname(@PathVariable String email) {
        log.info("이메일 기반 결제 내역 조회 요청: email={}", email); // 디버깅 로그
        if (email == null || email.isEmpty()) {
            log.error("이메일 값이 null 또는 비어 있습니다.");
            return ResponseEntity.badRequest().body("유효한 이메일을 입력하세요.");
        }
        List<Payment> payments = paymentService.getPaymentsByEmail(email);
        if (payments.isEmpty()) {
            log.warn("결제 내역이 존재하지 않습니다: email={}", email);
            return ResponseEntity.ok(Collections.emptyList());
        }
        log.info("결제 내역 조회 성공: {}건 조회됨", payments.size());
        return ResponseEntity.ok(payments);
    }
    /**
     * 환불 요청 처리
     */
    @PostMapping("/refund/request")
    public ResponseEntity<?> requestRefund(@RequestBody Map<String, String> request) {
        String impUid = request.get("impUid");
        log.info("환불 요청 수신: impUid={}", impUid);
        try {
            paymentService.requestRefund(impUid);
            log.info("환불 요청 처리 완료: impUid={}", impUid);
            return ResponseEntity.ok("환불 요청이 성공적으로 처리되었습니다.");
        } catch (Exception e) {
            log.error("환불 요청 처리 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("환불 요청 처리 실패: " + e.getMessage());
        }
    }


    /**
     * 환불 승인 또는 거부 처리
     */
    @PostMapping("/refund/process")
    public ResponseEntity<?> processRefund(@RequestParam String impUid, @RequestParam boolean approve) {
        try {
            log.info("환불 처리 요청 수신: impUid={}, approve={}", impUid, approve);
            paymentService.processRefund(impUid, approve);
            log.info("환불 처리 완료: impUid={}, approve={}", impUid, approve);
            return ResponseEntity.ok(approve ? "환불이 승인되었습니다." : "환불 요청이 거부되었습니다.");
        } catch (Exception e) {
            log.error("환불 처리 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("환불 처리 실패: " + e.getMessage());
        }
    }
}