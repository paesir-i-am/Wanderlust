package com.wanderlust.tourlist.controller;

import com.wanderlust.tourlist.dto.TourListDTO;
import com.wanderlust.tourlist.service.TourListLikeService;
import com.wanderlust.tourlist.service.TourListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
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
    private final TourListLikeService tourListLikeService;

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

    /**
     * 좋아요된 여행지 리스트 조회 API
     */
    @GetMapping("/like")
    public ResponseEntity<?> getLikedTours(@RequestParam String userId) {
        log.info("Fetching liked tours for user ID: {}", userId);
        List<TourListDTO> likedTours = tourListLikeService.getLikedToursByUser(userId);

        if (likedTours.isEmpty()) {
            log.warn("No liked tours found for user ID: {}", userId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(likedTours);
    }

    /**
     * 여행지 좋아요 추가 API
     */
    @PostMapping("/like")
    public ResponseEntity<?> likeTour(@RequestParam String userId, @RequestParam Long tourId) {
        log.info("Liking tour with ID: {} for user ID: {}", tourId, userId);
        String responseMessage = tourListLikeService.addLike(userId, tourId);

        if ("이미 좋아요에 추가한 여행지입니다.".equals(responseMessage)) {
            return ResponseEntity.badRequest().body(responseMessage);
        }
        return ResponseEntity.ok(responseMessage);
    }

    /**
     * 여행지 좋아요 삭제 API
     */
    @DeleteMapping("/like")
    public ResponseEntity<?> unlikeTour(@RequestParam String userId, @RequestParam Long tourId) {
        log.info("Unliking tour with ID: {} for user ID: {}", tourId, userId);
        try {
            tourListLikeService.removeLike(userId, tourId);
            return ResponseEntity.ok("좋아요가 삭제되었습니다.");
        } catch (Exception e) {
            log.error("Error while unliking tour ID: {} for user ID: {}: {}", tourId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("좋아요 삭제 중 오류가 발생했습니다.");
        }
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
