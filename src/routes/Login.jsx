import React, { useState } from "react";
import logo from "../assets/img/logo.jpg";
import google from "../assets/img/google.ico";
import kakao from "../assets/img/kakaotalk.ico";
import naver from "../assets/img/naver.ico";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div id="login">
        <span>
          <img src={logo} alt="로고" className="logo"></img>
        </span>
        <div>
          <form className="login_form">
            <div>
              <div className="login_input">
                <input
                  className="login_email"
                  type="email"
                  placeholder="사용자 이메일"
                  autoFocus
                />
                <input
                  className="login_pw"
                  type="password"
                  placeholder="비밀번호"
                />
              </div>
            </div>

            <div>
              <Link to="/main">
                <button className="login_btn">로그인</button>
              </Link>
            </div>
          </form>

          {/* 간편로그인 연결 미완성 */}
          <div className="social">
            <button>
              <img src={google} alt="구글"></img>
            </button>

            <button>
              <img src={kakao} alt="카카오"></img>
            </button>
            <button>
              <img src={naver} alt="네이버"></img>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
