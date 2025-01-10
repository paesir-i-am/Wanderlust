package com.wanderlust.tourlist.repository;

import com.wanderlust.tourlist.entity.GoogleMap;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoogleMapRepository extends JpaRepository<GoogleMap, Long> {
    // 필요한 경우 커스텀 쿼리를 추가할 수 있습니다.
}
