package com.wanderlust.tourlist.service;

import com.wanderlust.tourlist.entity.GoogleMap;
import com.wanderlust.tourlist.repository.GoogleMapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoogleMapServiceImpl implements GoogleMapService {

    private final GoogleMapRepository googleMapRepository;

    @Autowired
    public GoogleMapServiceImpl(GoogleMapRepository googleMapRepository) {
        this.googleMapRepository = googleMapRepository;
    }

    // 구글 맵 좌표 목록을 반환하는 메소드
    @Override
    public List<GoogleMap> getGoogleMaps() {
        return googleMapRepository.findAll();
    }

    // 특정 ID로 GoogleMap을 찾는 메소드
    @Override
    public GoogleMap getGoogleMapById(Long gno) {
        return googleMapRepository.findById(gno).orElse(null);
    }
}
