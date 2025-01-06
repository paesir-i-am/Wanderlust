package com.wanderlust.flight.controller;

import com.wanderlust.flight.dto.FlightDataDTO;
import com.wanderlust.flight.service.FlightDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flight/result")
public class FlightDataController {

    @Autowired
    private FlightDataService flightDataService;

    // 전체 데이터 조회
    @GetMapping
    public ResponseEntity<FlightDataDTO> getAllFlights() {
        return ResponseEntity.ok(flightDataService.getAllFlights());
    }
}