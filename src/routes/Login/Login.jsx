import React, { useState } from "react";
import logo from "assets/img/logo.jpg";
import google from "assets/img/ico/google.ico";
import kakao from "assets/img/ico/kakaotalk.ico";
import naver from "assets/img/ico/naver.ico";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginCheck, setLoginCheck] = useState(false);

  const onEmailHandler = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  const navigate = useNavigate();

  // 로그인 요청 핸들러
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (response.status === 200) {
        // 로그인 성공 시
        setLoginCheck(false);
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("email", result.email); // 이메일 저장
        console.log("로그인 성공, 이메일 주소: " + result.email);
        navigate("/mainview");
      } else {
        // 로그인 실패 시
        setLoginCheck(true);
      }
    } catch (error) {
      console.error("로그인 중 오류가 발생했습니다:", error);
      setLoginCheck(true);
    }
  };

  return (
    <>
      <div id="login">
        <span>
          <img src={logo} alt="로고" className="logo" />
        </span>
        <div>
          <form className="login_form" onSubmit={handleLogin}>
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
                  required // 비밀번호 비어있으면 안 됨.
                />
              </div>
              {loginCheck && <div>이메일 혹은 비밀번호를 확인해주세요.</div>}
            </div>

            <div>
              <button type="submit" className="login_btn">
                로그인
              </button>
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
