package com.wanderlust.flight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FareDetailDTO {
    private Long id;
    private String fareKey;
    private double adultFare;
    private double childFare;
    private double infantFare;
    private String fareType;

}
