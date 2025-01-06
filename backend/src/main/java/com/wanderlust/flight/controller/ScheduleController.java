package com.wanderlust.flight.controller;

import com.wanderlust.flight.entity.ScheduleDetail;
import com.wanderlust.flight.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/flight")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;


    // 스케줄 데이터 업로드
    @PostMapping("/schedules/upload")
    public String uploadSchedulesData(@RequestBody String jsonData) {
        try {

            scheduleService.deleteAllSchedules();

            // JSON 데이터 디버깅 로그 추가
            System.out.println("Received JSON Data: " + jsonData);

            // 서비스 호출
            scheduleService.processSchedulesData(jsonData);

            // 성공 메시지 반환
            return "Schedules data processed successfully!";
        } catch (Exception e) {
            // 예외 로그 추가
            System.err.println("Error processing schedules data: " + e.getMessage());
            e.printStackTrace();

            // 에러 메시지 반환
            return "Error processing schedules data: " + e.getMessage();
        }
    }

}

