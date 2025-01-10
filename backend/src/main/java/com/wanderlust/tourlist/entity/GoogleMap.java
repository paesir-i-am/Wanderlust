package com.wanderlust.tourlist.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "google_map")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@ToString
public class GoogleMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gno")
    private Long gno; // Google Map 테이블의 PK

    @Column(name = "latitude", nullable = false)
    private Double latitude; // 위도

    @Column(name = "longitude", nullable = false)
    private Double longitude; // 경도

    @OneToOne
    @JoinColumn(name = "tour_id", referencedColumnName = "tour_id", nullable = false)
    private TourList tourList; // TourList와 단방향 매핑
}
