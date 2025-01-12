package com.wanderlust.tourlist.controller;

import com.wanderlust.tourlist.dto.TourListDTO;
import com.wanderlust.tourlist.service.TourListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/tour")
public class TourListController {

    private final TourListService tourListService;

    /**
     * 여행지 리스트 조회 API (대륙 > 국가 > 도시 필터링 적용)
     * @param continentName 대륙 이름 (선택적)
     * @param countryName 국가 이름 (선택적)
     * @param cityName 도시 이름 (선택적)
     * @return 필터링된 여행지 리스트 또는 전체 여행지 리스트
     */
    @GetMapping("/list")
    public ResponseEntity<?> getFilteredTourList(
            @RequestParam(required = false) String continentName,
            @RequestParam(required = false) String countryName,
            @RequestParam(required = false) String cityName) {

        log.info("Fetching tours with filters - Continent: {}, Country: {}, City: {}",
                continentName, countryName, cityName);

        Object result;

        if (continentName == null && countryName == null && cityName == null) {
            result = tourListService.getContinentsCountriesCities();
            log.info("No filters applied, fetching all continent, country, and city data...");
        } else if (continentName != null && countryName == null) {
            result = tourListService.getCountriesByContinent(continentName);
            log.info("Filter by continent: {}", continentName);
        } else {
            result = tourListService.getTourListByCountryAndCity(countryName, cityName);
            log.info("Filter by country: {}, city: {}", countryName, cityName);
            log.info("Filtered Tour List Result: {}", result);
        }

        if (result == null || (result instanceof List && ((List<?>) result).isEmpty()) ||
                (result instanceof Map && ((Map<?, ?>) result).isEmpty())) {
            log.warn("No data found for the applied filters.");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(result);
    }

    // 도시 이름으로 검색
    @GetMapping("/read/by-city/{cityName}")
    public ResponseEntity<Long> getTourIdsByCityName(@PathVariable String cityName) {
        Long tourId = tourListService.getTourIdsByCityName(cityName);
        return ResponseEntity.ok(tourId);
    }

    @GetMapping("/read/{tourId}")
    public ResponseEntity<TourListDTO> getTourById(@PathVariable Long tourId) {
        System.out.println("Received tourId: " + tourId); // 디버깅 출력
        TourListDTO tour = tourListService.getTourById(tourId);
        System.out.println("Returned tour details: " + tour); // 반환 데이터 출력
        return ResponseEntity.ok(tour);
    }

    /**
     * 랜덤 여행지 리스트 조회 API
     * @param count 랜덤으로 가져올 여행지 개수
     * @return 랜덤으로 선택된 여행지 리스트
     */

    @GetMapping("/random")
    public ResponseEntity<List<TourListDTO>> getRandomTourList(@RequestParam(defaultValue = "3") int count) {
        log.info("Fetching {} random tours", count);

        // 랜덤 여행지 리스트 가져오기
        List<TourListDTO> randomTours = tourListService.getRandomTourList(count);

        if (randomTours.isEmpty()) {
            log.warn("No tours available for random selection.");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(randomTours);
    }
}
