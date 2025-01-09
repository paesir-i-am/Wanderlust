package com.wanderlust.payment.controller;

import com.wanderlust.payment.dto.PaymentRequestDTO;
import com.wanderlust.payment.service.PaymentService;
import com.wanderlust.payment.service.PortoneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}