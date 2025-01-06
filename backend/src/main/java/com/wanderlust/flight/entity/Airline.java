package com.wanderlust.flight.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Airline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "airline_id") // DB의 airline_id 컬럼과 매핑
    private Long id;

    @Column(name = "airline_code", unique = true, nullable = false) // DB의 airline_code 컬럼과 매핑
    private String airlineCode;

    @Column(name = "airline_name", nullable = false) // DB의 airline_name 컬럼과 매핑
    private String airlineName;
}