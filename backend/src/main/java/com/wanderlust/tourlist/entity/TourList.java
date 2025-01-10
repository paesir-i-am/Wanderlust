package com.wanderlust.tourlist.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tour_list")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@ToString
public class TourList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tour_id")
    private Long tourId; // 여행지 ID

    @Column(name = "tour_title", nullable = false)
    private String tourTitle; // 여행지 제목


    @Column(name = "tour_context", nullable = false)
    private String tourContext;

    @Column(name = "city_code_name", nullable = false) // City와 연결될 외래 키
    private String cityCodeName;
}