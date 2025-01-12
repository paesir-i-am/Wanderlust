package com.wanderlust.flight.controller;

import com.wanderlust.flight.service.AirportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flight")
public class AirportController {

    @Autowired
    private AirportService airportService;

    @PostMapping("airports/upload")
    public String uploadAirportsData(@RequestBody String jsonData) {
        try {
            airportService.deleteAllAirports();

            airportService.processAirportsData(jsonData);
            return "Airports data processed successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error processing airports data: " + e.getMessage();
        }
    }
}
