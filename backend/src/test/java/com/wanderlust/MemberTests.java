package com.wanderlust;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust
 * FileName       : MemberTests
 * Author         : paesir
 * Date           : 24. 12. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 16.오후 2:45  paesir      최초 생성
 */

import com.wanderlust.member.entity.Member;
import com.wanderlust.member.entity.MemberRole;
import com.wanderlust.member.repository.MemberRepository;
import com.wanderlust.member.service.MemberService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Commit;

import java.util.Optional;
import java.util.stream.IntStream;

@SpringBootTest
@Log4j2
    public class MemberTests {
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void insertMember(){

        IntStream.rangeClosed(1,100).forEach(i->{
            Member member = Member.builder()
                .email("email"+i+"@aaa.bbb")
                .nickname("nickname"+i)
                .pw(passwordEncoder.encode("1111"))
                .build();

            member.addRole(MemberRole.USER);

            if(i >= 90){
                member.addRole(MemberRole.ADMIN);
            }
            memberRepository.save(member);
        });
    }

}
