package com.wanderlust.tourlist.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "countries")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@ToString(exclude = "cities") // 도시 리스트 제외
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "country_code")
    private Long countryCode;  // 국가 ID (고유값)

    @Column(name = "continent_name", nullable = false)
    private String continentName;   // 대륙 이름 (아시아, 유럽 등)

    @Column(name = "continent_code_name", nullable = false)
    private String continentCodeName; // 대륙 코드 (ASIA, EUROPE 등)

    @Column(name = "country_name", nullable = false)
    private String countryName;     // 국가 이름 (우리나라, 일본 등)

    @Column(name = "country_code_name", nullable = false, unique = true)
    private String countryCodeName; // 국가 코드 (KR, JP 등)

    // City 테이블과 단방향 매핑
    @OneToMany
    @JoinColumn(name = "country_code_name", referencedColumnName = "country_code_name") // City 테이블의 외래 키와 매핑
    private List<City> cities = new ArrayList<>(); // 국가와 연결된 도시 리스트
}
