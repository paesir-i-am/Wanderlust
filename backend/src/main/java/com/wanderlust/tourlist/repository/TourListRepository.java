package com.wanderlust.tourlist.repository;

import com.wanderlust.tourlist.entity.TourList;
import com.wanderlust.tourlist.entity.TourListLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TourListRepository extends JpaRepository<TourList, Long> {

    // 특정 국가와 선택적으로 특정 도시의 여행지 리스트를 가져오기 (이미지 포함, tour_context 추가)
    @Query("SELECT t, c.cityName, c.cityImg, t.tourContext FROM TourList t " +
            "JOIN City c ON t.cityCodeName = c.cityCodeName " +
            "WHERE c.countryCodeName = (SELECT cc.countryCodeName FROM Country cc WHERE cc.countryName = :countryName) " +
            "AND (:cityName IS NULL OR c.cityName = :cityName) " +
            "AND c.cityName IS NOT NULL")
    List<Object[]> getByCountryAndCityWithImage(@Param("countryName") String countryName,
                                                @Param("cityName") String cityName);

    // 랜덤으로 여행지 리스트를 가져오기
    @Query(value = "SELECT t.tour_id, t.tour_title, t.tour_context, c.city_name, c.city_img " +
            "FROM tour_list t " +
            "JOIN cities c ON t.city_code_name = c.city_code_name " +
            "ORDER BY RAND() LIMIT :count", nativeQuery = true)
    List<Object[]> findRandomTourList(@Param("count") int count);

    // 좋아요 상태를 포함한 여행지 데이터 조회 (tour_context 추가)
    @Query("SELECT t, c.cityName, c.cityImg, t.tourContext, TRUE AS isLiked " +
            "FROM TourListLike l " +
            "JOIN l.city c " +
            "JOIN TourList t ON t.cityCodeName = c.cityCodeName " +
            "WHERE l.userId = :userId")
    List<Object[]> findAllLikesByUser(@Param("userId") String userId);

    // 특정 사용자가 특정 도시와 연관된 여행지에 좋아요를 눌렀는지 여부를 확인하는 메서드
    @Query("SELECT l FROM TourListLike l WHERE l.userId = :userId AND l.city.cityId = :cityId")
    Optional<TourListLike> findLikeByUserAndTour(@Param("userId") String userId, @Param("cityId") Long cityId);
}
