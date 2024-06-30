import React, { useState } from "react";
import logo from "assets/img/logo.jpg";
import google from "assets/img/ico/google.ico";
import kakao from "assets/img/ico/kakaotalk.ico";
import naver from "assets/img/ico/naver.ico";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onEmailHandler = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  const onLogin = (e) => {
    e.preventDefault();
  };

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
                  value={email}
                  onChange={onEmailHandler}
                  autoFocus
                  required // 이메일 비어있으면 안 됨.
                />
                <input
                  className="login_pw"
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={onPasswordHandler}
                />
              </div>
            </div>

            <div>
              <Link to="/mainview">
                <button className="login_btn" onSubmit={onLogin}>
                  로그인
                </button>
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
