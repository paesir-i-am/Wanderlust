package com.wanderlust.common.util;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.common.util
 * FileName       : CustomJWTException
 * Author         : paesir
 * Date           : 24. 12. 13.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 13.오후 5:29  paesir      최초 생성
 */


public class CustomJWTException extends RuntimeException{

    public CustomJWTException(String msg){
        super(msg);
    }

}
