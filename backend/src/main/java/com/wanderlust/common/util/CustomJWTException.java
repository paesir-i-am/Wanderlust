package com.wanderlust.common.util;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.common.util
 * FileName       : CustomJWTException
 * Author         : paesir
 * Date           : 24. 12. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 16.오후 2:32  paesir      최초 생성
 */


public class CustomJWTException extends RuntimeException{

    public CustomJWTException(String msg){
        super(msg);
    }

    public CustomJWTException(String msg, Throwable cause){
        super(msg, cause);
    }

}