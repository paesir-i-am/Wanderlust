package com.wanderlust.tourlist.repository;

import com.wanderlust.tourlist.dto.TourListDTO;
import com.wanderlust.tourlist.entity.TourList;
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

    @Query("SELECT t.tourId FROM TourList t JOIN City c ON t.cityCodeName = c.cityCodeName WHERE c.cityName = :cityName")
    List<Long> findTourIdsByCityName(@Param("cityName") String cityName);

    @Query("SELECT new com.wanderlust.tourlist.dto.TourListDTO(" +
        "t.tourId, t.tourTitle, c.cityName, c.cityImg, t.tourContext) " +
        "FROM TourList t " +
        "JOIN City c ON t.tourId = c.cityId " +
        "WHERE t.tourId = :tourId")
    Optional<TourListDTO> findTourWithCityById(@Param("tourId") Long tourId);

    // 랜덤으로 여행지 리스트를 가져오기
    @Query(value = "SELECT t.tour_id, t.tour_title, t.tour_context, c.city_name, c.city_img " +
            "FROM tour_list t " +
            "JOIN cities c ON t.city_code_name = c.city_code_name " +
            "ORDER BY RAND() LIMIT :count", nativeQuery = true)
    List<Object[]> findRandomTourList(@Param("count") int count);

}
