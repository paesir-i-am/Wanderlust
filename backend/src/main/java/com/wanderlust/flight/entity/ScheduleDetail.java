package com.wanderlust.flight.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class ScheduleDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sa; // 출발 공항
    private String ea; // 도착 공항
    private String av; // 항공사 코드
    private String fn; // 항공편 번호
    private String sdt; // 출발 시간
    private String edt; // 도착 시간
    private String jt; // 비행 시간
    private String ft; // 실제 비행 시간
    private String ct; // 연결 시간
    private String et; // 기종
    private boolean im; // 중간 경유 여부
    private double carbonEmission; // 탄소 배출량

    @ManyToOne
    @JoinColumn(name = "airline_id", referencedColumnName = "airline_id") // Airline 테이블과 매핑
    private Airline airline;


    private String airlineCode; // 항공사 코드
    private String airlineName;


    @ManyToOne
    @JoinColumn(name = "schedule_id") // Schedule 테이블의 외래 키
    private Schedule schedule;

    @ManyToOne(cascade = CascadeType.ALL)  // CascadeType.ALL을 추가하여 관련 객체가 함께 저장되도록 설정
    @JoinColumn(name = "fare_detail_id")
    private FareDetail fareDetail;

}



