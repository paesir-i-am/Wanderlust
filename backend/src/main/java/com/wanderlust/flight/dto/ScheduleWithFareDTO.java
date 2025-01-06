package com.wanderlust.flight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleWithFareDTO {
    private Long id;
    private String airlineCode;
    private String departureAirport;
    private String arrivalAirport;
    private String departureTime;
    private String arrivalTime;
    private String flightDuration;  // 비행 시간
    private String journeyTime;
    private boolean isDirect;       // 직항 여부
    private double carbonEmission;  // 탄소 배출량
    private double adultFare;       // 성인 요금
    private double childFare;       // 어린이 요금
    private double infantFare;      // 유아 요금

    public ScheduleWithFareDTO(Long id, String airlineCode, String departureAirport, String arrivalAirport,
                               String departureTime, String arrivalTime, boolean isDirect, String journeyTime,
                               double adultFare, double childFare, double infantFare) {
        this.id = id;
        this.airlineCode = airlineCode;
        this.departureAirport = departureAirport;
        this.arrivalAirport = arrivalAirport;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.isDirect = isDirect;
        this.journeyTime = journeyTime;
        this.adultFare = adultFare;
        this.childFare = childFare;
        this.infantFare = infantFare;
    }
}
