package com.wanderlust.flight.controller;

import com.wanderlust.flight.service.FareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flight")
public class FareController {

    @Autowired
    private FareService fareService;

    @PostMapping("/fares/upload")
    public String uploadFaresData(@RequestBody String jsonData) {
        try {
            fareService.deleteAllFares();

            fareService.processFaresData(jsonData);
            return "Fares data processed successfully.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to process fares data.";
        }
    }
}
