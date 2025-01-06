package com.wanderlust.flight.repository;

import com.wanderlust.flight.entity.Airline;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AirlineRepository extends JpaRepository<Airline, Long> {
    Airline findByAirlineCode(String airlineCode);


}
