package com.wanderlust.tourlist.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CountryDTO {

    private Long countryCode;       // 국가 ID(고유값)
    private String continentName;   // 대륙 이름 (아시아, 유럽 등)
    private String countryName;     // 국가 이름 (한국, 일본 등)
    private List<String> cityName; // 해당 국가에 속한 도시 이름 리스트
}
