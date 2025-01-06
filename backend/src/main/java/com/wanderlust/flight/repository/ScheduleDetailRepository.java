package com.wanderlust.flight.repository;

import com.wanderlust.flight.entity.ScheduleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleDetailRepository extends JpaRepository<ScheduleDetail, Long> {

    @Query("SELECT sd FROM ScheduleDetail sd WHERE sd.sa = :airportCode OR sd.ea = :airportCode")
    List<ScheduleDetail> findByAirportCode(@Param("airportCode") String airportCode);


}