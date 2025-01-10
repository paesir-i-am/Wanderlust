package com.wanderlust.tourlist.repository;

import com.wanderlust.tourlist.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Long> {
}
