package com.wanderlust.tourlist.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourListDTO {
    private Long tourId;
    private String tourTitle;
    private String cityName;
    private String cityImg; // 여행지의 도시 이미지 URL
    private String tourContext; //여행지 설명
}
