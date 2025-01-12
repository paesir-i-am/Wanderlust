package com.wanderlust.flight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirportDTO {
    private Long airport_id;
    private String airport_code;
    private String airport_name;
}
