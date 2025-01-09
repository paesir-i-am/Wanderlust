package com.wanderlust.flight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirlineDTO {
    @Id
    private Long airline_id; // airline_id와 매핑
    private String airline_code; // airline_code와 매핑
    private String airline_name;
}
