package com.wanderlust.tourlist.controller;

import com.wanderlust.tourlist.entity.GoogleMap;
import com.wanderlust.tourlist.service.GoogleMapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/googlemap")
public class GoogleMapController {

    private final GoogleMapService googleMapService;

    @Autowired
    public GoogleMapController(GoogleMapService googleMapService) {
        this.googleMapService = googleMapService;
    }

    // 모든 GoogleMap 데이터를 가져오는 API
    @GetMapping("/all")
    public List<GoogleMap> getAllGoogleMaps() {
        return googleMapService.getGoogleMaps();
    }

    // 특정 GoogleMap 데이터 가져오는 API
    @GetMapping("/{gno}")
    public GoogleMap getGoogleMapById(Long gno) {
        return googleMapService.getGoogleMapById(gno);
    }
}
