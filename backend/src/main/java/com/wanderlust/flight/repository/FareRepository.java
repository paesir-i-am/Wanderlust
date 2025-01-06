package com.wanderlust.flight.repository;

import com.wanderlust.flight.entity.Fare;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FareRepository extends JpaRepository<Fare, Long> {

}
