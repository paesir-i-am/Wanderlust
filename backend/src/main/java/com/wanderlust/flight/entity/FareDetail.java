package com.wanderlust.flight.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
public class FareDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fareType;
    private String agtCode;
    private String confirmType;
    private String baggageType;

    @Column(columnDefinition = "TEXT")
    private String reserveParameter; // ReserveParameter URL

    private String promotionParameter;
    private double adultFare;
    private double adultTax;
    private double adultQCharge;
    private double childFare;
    private double childTax;
    private double childQCharge;
    private double infantFare;
    private double infantTax;
    private double infantQCharge;

    @OneToMany(mappedBy = "fareDetail", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ScheduleDetail> scheduleDetails = new ArrayList<>();
}
