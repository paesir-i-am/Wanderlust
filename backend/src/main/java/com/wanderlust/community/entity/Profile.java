package com.wanderlust.community.entity;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.entity
 * FileName       : Profile
 * Author         : paesir
 * Date           : 25. 1. 1.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 1.오후 11:58  paesir      최초 생성
 */

import com.wanderlust.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
    public class Profile {
    @Id
    @OneToOne
    @JoinColumn(name = "nickname", referencedColumnName = "nickname")
    private Member member; // Member 엔터티 참조

    @Column(length = 1000) // 글자수 제한
    private String bio; // 자기소개

    private String profileImage; // 프로필 이미지
}
