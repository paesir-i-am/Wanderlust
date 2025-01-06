package com.wanderlust.flight.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Airport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long airport_id;
    private String airport_code; // 공항 코드
    private String airport_name; // 공항 이름

}