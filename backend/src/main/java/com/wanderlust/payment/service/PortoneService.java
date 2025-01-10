package com.wanderlust.payment.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ParseException;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PortoneService {

    @Value("${portone.api-key}")
    private String apiKey;

    @Value("${portone.api-secret}")
    private String apiSecret;

    public String getAccessToken() throws IOException {
        String url = "https://api.portone.io/users/getToken";
        HttpPost post = new HttpPost(url);
        post.setHeader("Content-Type", "application/json");

        StringEntity entity = new StringEntity(new Gson().toJson(Map.of(
                "imp_key", apiKey,
                "imp_secret", apiSecret
        )));
        post.setEntity(entity);

        try (CloseableHttpClient client = HttpClients.createDefault();
             CloseableHttpResponse response = client.execute(post)) {
            String responseBody = EntityUtils.toString(response.getEntity());
            JsonObject jsonResponse = JsonParser.parseString(responseBody).getAsJsonObject();
            return jsonResponse.getAsJsonObject("response").get("access_token").getAsString();
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    public void validatePayment(String impUid, int amount, String token) throws IOException {
        String url = "https://api.portone.io/payments/" + impUid;

        // 요청 URL 및 인증 토큰 디버깅
        System.out.println("PortOne API 요청 URL: " + url);
        System.out.println("Authorization Token: " + token);

        HttpGet get = new HttpGet(url);
        get.setHeader("Authorization", token);

        try (CloseableHttpClient client = HttpClients.createDefault();
             CloseableHttpResponse response = client.execute(get)) {

            // 응답 상태 코드와 본문 디버깅
            int statusCode = response.getCode();
            String responseBody = EntityUtils.toString(response.getEntity());

            System.out.println("PortOne API 응답 코드: " + statusCode);
            System.out.println("PortOne API 응답 본문: " + responseBody);

            // 응답 상태 코드 확인
            if (statusCode != 200) {
                throw new IllegalArgumentException("결제 검증 실패: HTTP 상태 코드 " + statusCode);
            }

            // 응답 본문 파싱
            JsonObject jsonResponse = JsonParser.parseString(responseBody).getAsJsonObject();

            // 응답에서 "response" 객체 확인
            if (!jsonResponse.has("response") || jsonResponse.get("response").isJsonNull()) {
                throw new IllegalArgumentException("결제 검증 실패: 'response'가 null입니다.");
            }

            JsonObject paymentInfo = jsonResponse.getAsJsonObject("response");

            // 결제 금액 비교
            int paidAmount = paymentInfo.get("amount").getAsInt();
            System.out.println("PortOne 결제 금액: " + paidAmount);
            System.out.println("요청된 금액: " + amount);

            if (paidAmount != amount) {
                throw new IllegalArgumentException("결제 금액이 일치하지 않습니다.");
            }
        } catch (ParseException e) {
            System.err.println("JSON 파싱 중 오류 발생: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}