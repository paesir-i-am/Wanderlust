package com.wanderlust.tourlist.service;

import com.wanderlust.tourlist.dto.TourListDTO;
import com.wanderlust.tourlist.entity.City;
import com.wanderlust.tourlist.entity.TourList;
import com.wanderlust.tourlist.entity.TourListLike;
import com.wanderlust.tourlist.repository.TourListRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class TourListLikeServiceImpl implements TourListLikeService {

    private final TourListRepository tourListRepository;
    private final EntityManager entityManager;
    private final ModelMapper modelMapper = new ModelMapper(); // ModelMapper 인스턴스
    private static final String IMAGE_BASE_URL = "http://localhost:8080/";

    // 좋아요 데이터 조회
    @Override
    public List<TourListDTO> getLikedToursByUser(String userId) {
        List<Object[]> results = tourListRepository.findAllLikesByUser(userId);
        log.info("사용자 ID: {}의 좋아요 데이터를 조회합니다.", userId);

        return results.stream().map(result -> {
            TourList tour = (TourList) result[0];
            TourListDTO dto = modelMapper.map(tour, TourListDTO.class);

            dto.setCityName((String) result[1]);

            String originalCityImg = (String) result[2];
            if (originalCityImg != null) {
                dto.setCityImg(IMAGE_BASE_URL + extractImageFileName(originalCityImg));
            } else {
                dto.setCityImg(null);
            }

            // tour_context 추가
            dto.setTourContext((String) result[3]); // result[3]에서 tour_context를 가져와 설정

            return dto;
        }).collect(Collectors.toList());
    }

    // 좋아요 데이터 추가
    @Override
    public String addLike(String userId, Long tourId) {
        // 기존 좋아요 여부 확인
        Optional<TourListLike> existingLike = tourListRepository.findLikeByUserAndTour(userId, tourId);
        if (existingLike.isPresent()) {
            log.warn("이미 좋아요에 추가한 여행지입니다. Tour ID: {}", tourId);
            return "이미 좋아요에 추가한 여행지입니다.";
        }

        // TourList를 통해 City 조회
        TourList tour = tourListRepository.findById(tourId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 여행지입니다. Tour ID: " + tourId));

        City city = entityManager.createQuery(
                        "SELECT c FROM City c WHERE c.cityCodeName = :cityCodeName", City.class)
                .setParameter("cityCodeName", tour.getCityCodeName())
                .getSingleResult();

        TourListLike newLike = TourListLike.builder()
                .userId(userId)
                .city(city)
                .liked(true)
                .build();

        entityManager.persist(newLike);
        log.info("좋아요 데이터가 추가되었습니다. Tour ID: {}", tourId);
        return "좋아요가 추가되었습니다.";
    }

    // 좋아요 데이터 삭제
    @Override
    public void removeLike(String userId, Long tourId) {
        Optional<TourListLike> existingLike = tourListRepository.findLikeByUserAndTour(userId, tourId);
        if (existingLike.isEmpty()) {
            log.warn("좋아요 데이터가 존재하지 않습니다. Tour ID: {}", tourId);
            return;
        }

        entityManager.remove(existingLike.get());
        log.info("좋아요 데이터가 삭제되었습니다. Tour ID: {}", tourId);
    }

    // 새로 추가된 메서드: 파일 이름만 추출
    private String extractImageFileName(String fullPath) {
        // Windows 경로 (\\)와 Unix 경로 (/) 모두 지원
        int lastSeparatorIndex = Math.max(fullPath.lastIndexOf('/'), fullPath.lastIndexOf('\\'));
        return fullPath.substring(lastSeparatorIndex + 1); // 파일 이름 반환
    }
}
