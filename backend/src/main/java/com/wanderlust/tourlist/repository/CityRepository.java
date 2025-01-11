package com.wanderlust.tourlist.repository;

import com.wanderlust.tourlist.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CityRepository extends JpaRepository<City, Long> {
  Optional<City> findByCityName(String cityName);
}
