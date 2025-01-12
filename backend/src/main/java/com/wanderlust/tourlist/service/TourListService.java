package com.wanderlust.tourlist.service;

import com.wanderlust.tourlist.dto.CountryDTO;
import com.wanderlust.tourlist.dto.TourListDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Transactional
public interface TourListService {

    // 대륙별 국가 및 도시 데이터를 반환
    Map<String, List<String>> getContinentsCountriesCities();

    // 특정 대륙에 속한 국가 리스트 반환
    List<CountryDTO> getCountriesByContinent(String continentName);

    // 특정 국가와 도시의 여행지 리스트 반환
    List<TourListDTO> getTourListByCountryAndCity(String countryCodeName, String cityCodeName);

    Long getTourIdsByCityName(String cityName);

    TourListDTO getTourById(Long tourId);

    // 랜덤으로 여행지 리스트 반환
    List<TourListDTO> getRandomTourList(int count);


}