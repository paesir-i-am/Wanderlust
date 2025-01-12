package com.wanderlust.flight.repository;

import com.wanderlust.flight.entity.FareType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FareTypeRepository extends JpaRepository<FareType, Long> {
}