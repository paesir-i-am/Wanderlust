package com.wanderlust.flight.controller;

import com.wanderlust.flight.service.FareTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flight")
public class FareTypeController {

    @Autowired
    private FareTypeService fareTypeService;

    @PostMapping("/fareTypes/upload")
    public String uploadFareTypesData(@RequestBody String jsonData) {
        try {
            fareTypeService.deleteAllFareTypes();

            fareTypeService.processFareTypesData(jsonData);
            return "FareTypes data processed successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error processing FareTypes data: " + e.getMessage();
        }
    }
}
