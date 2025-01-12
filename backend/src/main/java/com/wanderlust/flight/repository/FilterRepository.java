package com.wanderlust.flight.repository;

import com.wanderlust.flight.entity.ScheduleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FilterRepository extends JpaRepository<ScheduleDetail, Long>, JpaSpecificationExecutor<ScheduleDetail> {
}
