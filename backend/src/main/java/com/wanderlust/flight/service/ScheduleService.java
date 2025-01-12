package com.wanderlust.flight.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlust.flight.entity.*;
import com.wanderlust.flight.repository.AirlineRepository;
import com.wanderlust.flight.repository.FareDetailRepository;
import com.wanderlust.flight.repository.ScheduleDetailRepository;
import com.wanderlust.flight.repository.ScheduleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private FareDetailRepository fareDetailRepository;

    @Autowired
    private ScheduleDetailRepository scheduleDetailRepository;

    public void deleteAllSchedules() {
        // ScheduleDetail 삭제 (종속성에 따라)
        scheduleDetailRepository.deleteAll();

        // Schedule 삭제
        scheduleRepository.deleteAll();
    }

    public List<ScheduleDetail> getSchedulesByAirportCode(String airportCode) {
        return scheduleDetailRepository.findByAirportCode(airportCode);
    }

    @Transactional
    public void processSchedulesData(String jsonData) throws Exception {
        // JSON 데이터 파싱
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonData);

        if (rootNode.isArray()) {
            for (JsonNode scheduleNode : rootNode) {
                for (Iterator<Map.Entry<String, JsonNode>> it = scheduleNode.fields(); it.hasNext(); ) {
                    Map.Entry<String, JsonNode> entry = it.next();

                    String scheduleId = entry.getKey();
                    JsonNode scheduleData = entry.getValue();

                    // Schedule 엔티티 생성 및 설정
                    Schedule schedule = createSchedule(scheduleId, scheduleData);

                    // ScheduleDetail 생성 및 매핑
                    List<ScheduleDetail> details = processDetails(schedule, scheduleData.get("detail"));
                    schedule.setDetails(details);

                    // 데이터 저장
                    scheduleRepository.save(schedule);
                }
            }
        }

        // 기존 Schedule 데이터 업데이트
        updateAirlineData();
    }

    private Schedule createSchedule(String scheduleId, JsonNode scheduleData) {
        Schedule schedule = new Schedule();
        schedule.setScheduleId(scheduleId);

        // 여정 시간 설정
        JsonNode journeyTimeNode = scheduleData.get("journeyTime");
        if (journeyTimeNode != null && journeyTimeNode.isArray()) {
            String journeyHours = journeyTimeNode.get(0).asText();
            String journeyMinutes = journeyTimeNode.get(1).asText();
            schedule.setJourneyTime(journeyHours + ":" + journeyMinutes);
        }
        return schedule;
    }

    private List<ScheduleDetail> processDetails(Schedule schedule, JsonNode detailNode) {
        List<ScheduleDetail> details = new ArrayList<>();
        if (detailNode != null && detailNode.isArray()) {
            for (JsonNode detail : detailNode) {
                ScheduleDetail detailEntity = mapDetail(schedule, detail);

                // FareDetail 매핑
                processFareDetail(detailEntity, detail.get("fare"));

                details.add(detailEntity);
            }
        }
        return details;
    }

    private ScheduleDetail mapDetail(Schedule schedule, JsonNode detail) {
        ScheduleDetail detailEntity = new ScheduleDetail();
        detailEntity.setSa(detail.get("sa").asText());
        detailEntity.setEa(detail.get("ea").asText());
        detailEntity.setAv(detail.get("av").asText());
        detailEntity.setFn(detail.get("fn").asText());
        detailEntity.setSdt(detail.get("sdt").asText());
        detailEntity.setEdt(detail.get("edt").asText());
        detailEntity.setJt(detail.get("jt").asText());
        detailEntity.setFt(detail.get("ft").asText());
        detailEntity.setCt(detail.get("ct").asText());
        detailEntity.setEt(detail.get("et").asText());
        detailEntity.setIm(detail.get("im").asBoolean());
        detailEntity.setSchedule(schedule);

        // carbonEmission 필드 처리
        if (detail.has("carbonEmission") && !detail.get("carbonEmission").isNull()) {
            detailEntity.setCarbonEmission(detail.get("carbonEmission").asDouble());
        } else {
            detailEntity.setCarbonEmission(0.0); // 기본값 설정
        }

        // Airline 데이터 매핑
        Airline airline = airlineRepository.findByAirlineCode(detailEntity.getAv());
        if (airline != null) {
            detailEntity.setAirlineCode(airline.getAirlineCode());
            detailEntity.setAirlineName(airline.getAirlineName());
        }

        return detailEntity;
    }

    private void updateAirlineData() {
        List<Schedule> schedules = scheduleRepository.findAll();
        for (Schedule schedule : schedules) {
            for (ScheduleDetail detail : schedule.getDetails()) {
                // Airline 데이터를 가져옴
                Airline airline = airlineRepository.findByAirlineCode(detail.getAv());
                if (airline != null) {
                    // Airline 정보를 ScheduleDetail에 매핑
                    detail.setAirline(airline);
                    detail.setAirlineCode(airline.getAirlineCode());
                    detail.setAirlineName(airline.getAirlineName());
                }
            }
        }

        // 변경된 Schedule 데이터를 저장
        scheduleRepository.saveAll(schedules);
    }

    private void processFareDetail(ScheduleDetail detailEntity, JsonNode fareNode) {
        if (fareNode != null) {
            JsonNode fareDetailNode = fareNode.get("details");
            if (fareDetailNode != null && fareDetailNode.isArray()) {
                for (JsonNode fd : fareDetailNode) {
                    // fare_key 기준으로 매핑 (출발 공항, 도착 공항, 출발 시간 등을 기준으로 매핑)
                    String fareKey = fd.get("fareKey").asText();  // fare_key 추출
                    String scheduleFareKey = detailEntity.getSa() + detailEntity.getEa() + detailEntity.getSdt();  // Schedule의 출발 공항 + 도착 공항 + 출발 시간

                    // fare_key와 scheduleFareKey 비교
                    if (fareKey.equals(scheduleFareKey)) {
                        // FareDetail 매핑
                        FareDetail fareDetail = new FareDetail();
                        fareDetail.setFareType(fd.get("fareType").asText());
                        fareDetail.setAdultFare(fd.get("adultFare").asDouble());
                        fareDetail.setChildFare(fd.get("childFare").asDouble());
                        fareDetail.setInfantFare(fd.get("infantFare").asDouble());
                        fareDetail.setAgtCode(fd.get("agtCode").asText());
                        fareDetail.setBaggageType(fd.get("baggageType").asText());

                        // FareDetail 저장
                        FareDetail savedFareDetail = fareDetailRepository.save(fareDetail);

                        // 매핑된 FareDetail을 ScheduleDetail에 연결
                        detailEntity.setFareDetail(savedFareDetail);
                        System.out.println("Mapped FareDetail to ScheduleDetail: " + savedFareDetail.getFareType());

                        // ScheduleDetail 저장 (이 부분이 빠지지 않았는지 확인)
                        scheduleDetailRepository.save(detailEntity);
                        break;  // 일치하는 항목을 찾았으면 더 이상 탐색하지 않음
                    } else {
                        System.out.println("FareDetail not matched for ScheduleDetail fareKey: " + scheduleFareKey);
                    }
                }
            } else {
                System.out.println("Fare details not found for the schedule.");
            }
        } else {
            System.out.println("Fare node not found in the schedule detail.");
        }
    }
}