package com.wanderlust.flight.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlust.flight.entity.FareType;
import com.wanderlust.flight.repository.FareTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.Map;

@Service
public class FareTypeService {

    @Autowired
    private FareTypeRepository fareTypeRepository;

    public void deleteAllFareTypes() {
        fareTypeRepository.deleteAll(); // FareType 테이블의 모든 데이터를 삭제
    }

    public void processFareTypesData(String jsonData) throws Exception {
        // JSON 데이터 파싱
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonData);

        // JSON 객체 파싱
        if (rootNode.isObject()) {
            Iterator<Map.Entry<String, JsonNode>> fields = rootNode.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> field = fields.next();

                // FareType 엔티티 생성
                FareType fareType = new FareType();
                fareType.setCode(field.getKey()); // 요금 타입 코드
                fareType.setDescription(field.getValue().asText()); // 요금 타입 설명

                // 데이터 저장
                fareTypeRepository.save(fareType);
            }
        }
    }
}
