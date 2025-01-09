package com.wanderlust.flight.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class FareType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code; // 요금 타입 코드 (e.g., A01/B96)
    private String description; // 요금 타입 설명 (e.g., 성인/삼성 iD GLOBAL 카드)
}