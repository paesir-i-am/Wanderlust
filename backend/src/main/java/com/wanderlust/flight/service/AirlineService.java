package com.wanderlust.flight.service;

import com.wanderlust.flight.entity.Airline;
import com.wanderlust.flight.repository.AirlineRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.Map;

@Service
public class AirlineService {
    @Autowired
    private AirlineRepository airlineRepository;

    public void deleteAllAirlines() {
        airlineRepository.deleteAll();
    }

    public void processAirlinesData(String jsonData) throws Exception {
        // JSON 데이터를 ObjectMapper로 파싱
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonData);

        // Airlines 데이터 접근
        JsonNode airlinesNode = rootNode;

        if (airlinesNode.isObject()) {
            Iterator<Map.Entry<String, JsonNode>> fields = airlinesNode.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> field = fields.next();
                // Airline 엔티티 생성
                Airline airline = new Airline();
                airline.setAirlineCode(field.getKey()); // 항공사 코드
                airline.setAirlineName(field.getValue().asText()); // 항공사 이름


                // 데이터 저장
                airlineRepository.save(airline);
            }
        }
    }
}
