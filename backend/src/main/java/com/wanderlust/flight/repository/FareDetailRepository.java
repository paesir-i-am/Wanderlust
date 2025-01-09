package com.wanderlust.flight.repository;

import com.wanderlust.flight.entity.Fare;
import com.wanderlust.flight.entity.FareDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FareDetailRepository extends JpaRepository<FareDetail, Long> {
}