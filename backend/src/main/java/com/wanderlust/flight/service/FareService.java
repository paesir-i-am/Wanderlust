package com.wanderlust.flight.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlust.flight.entity.Fare;
import com.wanderlust.flight.entity.FareDetail;
import com.wanderlust.flight.repository.FareRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
public class FareService {

    @Autowired
    private FareRepository fareRepository;

    public void deleteAllFares() {
        fareRepository.deleteAll();
    }

    @Transactional
    public void processFaresData(String jsonData) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonData);

        if (rootNode.isObject()) {
            for (Iterator<Map.Entry<String, JsonNode>> it = rootNode.fields(); it.hasNext(); ) {
                Map.Entry<String, JsonNode> entry = it.next();

                String fareKey = entry.getKey(); // e.g., "20250123ICNNRT7C1107|20250124NRTICN7C1122"
                JsonNode fareData = entry.getValue();

                Fare fare = new Fare();
                fare.setFareKey(fareKey);

                // 'fare' 필드 안의 데이터를 처리
                JsonNode fareFieldNode = fareData.get("fare");
                if (fareFieldNode != null && fareFieldNode.isObject()) {
                    List<FareDetail> fareDetails = new ArrayList<>();

                    for (Iterator<Map.Entry<String, JsonNode>> fareFieldIterator = fareFieldNode.fields(); fareFieldIterator.hasNext(); ) {
                        Map.Entry<String, JsonNode> fareEntry = fareFieldIterator.next();

                        String fareType = fareEntry.getKey(); // e.g., "A01"
                        JsonNode fareDetailsArray = fareEntry.getValue();

                        if (fareDetailsArray != null && fareDetailsArray.isArray()) {
                            for (JsonNode detailNode : fareDetailsArray) {
                                FareDetail fareDetail = new FareDetail();

                                fareDetail.setFareType(fareType); // fareType 설정
                                fareDetail.setAgtCode(detailNode.get("AgtCode").asText());
                                fareDetail.setConfirmType(detailNode.get("ConfirmType").asText());
                                fareDetail.setBaggageType(detailNode.get("BaggageType").asText());

                                // ReserveParameter와 PromotionParameter 처리
                                JsonNode reserveParamNode = detailNode.get("ReserveParameter").get("#cdata-section");
                                fareDetail.setReserveParameter(reserveParamNode != null ? reserveParamNode.asText() : null);

                                JsonNode promotionParamNode = detailNode.get("PromotionParameter").get("#cdata-section");
                                fareDetail.setPromotionParameter(promotionParamNode != null ? promotionParamNode.asText() : null);

                                // Adult, Child, Infant 정보 처리
                                JsonNode adultNode = detailNode.get("Adult");
                                if (adultNode != null) {
                                    fareDetail.setAdultFare(adultNode.get("Fare").asDouble());
                                    fareDetail.setAdultTax(adultNode.get("Tax").asDouble());
                                    fareDetail.setAdultQCharge(adultNode.get("QCharge").asDouble());
                                }

                                JsonNode childNode = detailNode.get("Child");
                                if (childNode != null) {
                                    fareDetail.setChildFare(childNode.get("Fare").asDouble());
                                    fareDetail.setChildTax(childNode.get("Tax").asDouble());
                                    fareDetail.setChildQCharge(childNode.get("QCharge").asDouble());
                                }

                                JsonNode infantNode = detailNode.get("Infant");
                                if (infantNode != null) {
                                    fareDetail.setInfantFare(infantNode.get("Fare").asDouble());
                                    fareDetail.setInfantTax(infantNode.get("Tax").asDouble());
                                    fareDetail.setInfantQCharge(infantNode.get("QCharge").asDouble());
                                }

                                fareDetails.add(fareDetail);
                            }
                        }
                    }

                    fare.setDetails(fareDetails);
                }

                System.out.println("Saving Fare: " + fare);
                fareRepository.save(fare);
            }
        }
    }
}
