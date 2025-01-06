package com.wanderlust.flight.service;

import com.wanderlust.flight.dto.*;
import com.wanderlust.flight.entity.*;
import com.wanderlust.flight.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FlightDataService {

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private FareRepository fareRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    // 전체 항공 데이터 조회
    public FlightDataDTO getAllFlights() {
        // Airlines
        List<AirlineDTO> airlines = airlineRepository.findAll().stream()
                .map(airline -> new AirlineDTO(
                        airline.getId(),
                        airline.getAirlineCode(),
                        airline.getAirlineName()
                ))
                .collect(Collectors.toList());

        // Airports
        List<AirportDTO> airports = airportRepository.findAll().stream()
                .map(airport -> new AirportDTO(
                        airport.getAirport_id(),
                        airport.getAirport_code(),
                        airport.getAirport_name()
                ))
                .collect(Collectors.toList());

        // Fares (FareDetailDTO에 fareKey 포함)
        List<FareDetailDTO> fares = fareRepository.findAll().stream()
                .flatMap(fare -> fare.getDetails().stream()
                        .map(detail -> new FareDetailDTO(
                                detail.getId(),
                                fare.getFareKey(),  // FareKey를 FareDetail에 포함
                                detail.getAdultFare(),
                                detail.getChildFare(),
                                detail.getInfantFare(),
                                detail.getFareType()
                        )))
                .collect(Collectors.toList());

        // Schedules (ScheduleWithFareDTO)
        List<ScheduleWithFareDTO> schedules = scheduleRepository.findAll().stream()
                .flatMap(schedule -> schedule.getDetails().stream()
                        .map(detail -> {
                            // FareDetail을 가져옴
                            FareDetail fareDetail = detail.getFareDetail();

                            // ScheduleWithFareDTO 생성
                            return new ScheduleWithFareDTO(
                                    detail.getId(),
                                    detail.getAv(),
                                    detail.getSa(),
                                    detail.getEa(),
                                    detail.getSdt(),
                                    detail.getEdt(),
                                    detail.isIm(),
                                    detail.getJt(),
                                    fareDetail != null ? fareDetail.getAdultFare() : 0.0,
                                    fareDetail != null ? fareDetail.getChildFare() : 0.0,
                                    fareDetail != null ? fareDetail.getInfantFare() : 0.0
                            );
                        }))
                .collect(Collectors.toList());

        return new FlightDataDTO(airlines, airports, fares, schedules);  // fares는 FareDetailDTO로 반환됨
    }
}
