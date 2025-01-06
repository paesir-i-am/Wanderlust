package com.wanderlust.tourlist.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "list_like") // 좋아요 테이블
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class TourListLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fno")
    private Long fno; // 좋아요 항목 ID (고유값)

    @Column(name = "user_id", nullable = false)
    private String userId; // 사용자 ID

    @Column(name = "liked", nullable = false)
    private Boolean liked; // 좋아요 여부

    @ManyToOne
    @JoinColumn(name = "city_id", referencedColumnName = "city_id", nullable = false)
    private City city; // 좋아요와 연결된 도시
}
