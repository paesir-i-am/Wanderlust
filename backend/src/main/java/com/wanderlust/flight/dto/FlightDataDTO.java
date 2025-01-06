package com.wanderlust.flight.dto;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FlightDataDTO {
        private List<AirlineDTO> airlines;
        private List<AirportDTO> airports;
        private List<FareDetailDTO> fares;
        private List<ScheduleWithFareDTO> schedules;
}
