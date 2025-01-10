package com.wanderlust.tourlist.repository;

import com.wanderlust.tourlist.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CountryRepository extends JpaRepository<Country, Long> {

    // 대륙별 국가 목록 조회
    @Query("SELECT c FROM Country c WHERE c.continentName = :continentName")
    List<Country> getCountriesByContinent(@Param("continentName") String continentName);

    // 모든 대륙, 국가, 도시 데이터를 Fetch Join으로 가져오기
    @Query("SELECT DISTINCT c FROM Country c JOIN FETCH c.cities")
    List<Country> findAllWithCities();
}
