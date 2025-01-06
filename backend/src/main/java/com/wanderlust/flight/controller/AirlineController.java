package com.wanderlust.flight.controller;

import com.wanderlust.flight.service.AirlineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flight")
public class AirlineController {

    @Autowired
    private AirlineService airlineService;

    @PostMapping("/airlines/upload")
    public String uploadAirlinesData(@RequestBody String jsonData) {
        try {
            airlineService.deleteAllAirlines();

            airlineService.processAirlinesData(jsonData);
            return "Airlines data processed successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error processing airlines data: " + e.getMessage();
        }
    }
}
