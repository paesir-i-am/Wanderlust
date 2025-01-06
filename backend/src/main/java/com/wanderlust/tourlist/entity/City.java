package com.wanderlust.tourlist.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cities")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"tourLists"}) // 무한 루프 방지를 위해 tourLists 제외
@Getter
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "city_id")
    private Long cityId;  // 도시 ID (고유값)

    @Column(name = "city_name", nullable = false)
    private String cityName; // 도시 이름 (서울, 경기 등)

    @Column(name = "city_code_name", nullable = false, unique = true)
    private String cityCodeName; // 도시 코드 (SEOUL, TOKYO 등)

    @Column(name = "city_img", nullable = false, unique = true)
    private String cityImg;  // 도시 이미지 경로 (외래 키로 참조되기 때문에 유일성 보장)

    @Column(name = "country_code_name", nullable = false) // Country와 연결될 외래 키
    private String countryCodeName;

    // TourList와의 단방향 매핑
    @OneToMany
    @JoinColumn(name = "city_code_name", referencedColumnName = "city_code_name") // TourList 테이블의 외래 키와 매핑
    private List<TourList> tourLists = new ArrayList<>(); // 도시와 연결된 여행지 목록
}