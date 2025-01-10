package com.wanderlust.tourlist.service;

import com.wanderlust.tourlist.entity.GoogleMap;

import java.util.List;

public interface GoogleMapService {

    List<GoogleMap> getGoogleMaps();
    GoogleMap getGoogleMapById(Long gno);
}
