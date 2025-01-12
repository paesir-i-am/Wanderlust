package com.wanderlust.member.dto;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.dto
 * FileName       : MemberDTO
 * Author         : paesir
 * Date           : 24. 12. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 16.오후 2:23  paesir      최초 생성
 */


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;
import java.util.stream.Collectors;

@Getter
@Setter
@ToString
public class MemberDTO extends User implements OAuth2User {

    private String email;

    private String pw;

    private String nickname;

    private boolean social;

    private List<String> roleNames = new ArrayList<>();

    private Map<String, Object> props;

    public MemberDTO(String email, String pw, String nickname, boolean social, List<String> roleNames) {
        super(
            Optional.ofNullable(email).orElseThrow(() -> new IllegalArgumentException("Email cannot be null")),
            Optional.ofNullable(pw).orElseThrow(() -> new IllegalArgumentException("Password cannot be null")),
            (roleNames != null ? roleNames : Collections.emptyList())
                .stream()
                .map(str -> new SimpleGrantedAuthority("ROLE_" + str))
                .collect(Collectors.toList())
        );

        this.email = email;
        this.pw = pw;
        this.nickname = nickname;
        this.social = social;
        this.roleNames = roleNames != null ? roleNames : new ArrayList<>();
    }

    public Map<String, Object> getClaims() {

        Map<String, Object> dataMap = new HashMap<>();

        dataMap.put("email", email);
        dataMap.put("pw",pw);
        dataMap.put("nickname", nickname);
        dataMap.put("social", social);
        dataMap.put("roleNames", roleNames);

        return dataMap;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return this.getProps();
    }

    @Override
    public String getName() {
        return this.email;
    }
}