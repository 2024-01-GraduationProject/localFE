import React, { useState, useRef } from "react";
import logo from "assets/img/logo.jpg";
import google from "assets/img/ico/google.ico";
import kakao from "assets/img/ico/kakaotalk.ico";
import naver from "assets/img/ico/naver.ico";
import { useNavigate } from "react-router-dom";
import KakaoLogin from "./KakaoLogin";
import GoogleLogin from "./GoogleLogin";
import api from "../../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCheck, setEmailCheck] = useState("");
  const [loginCheck, setLoginCheck] = useState(false);

  const kakaoLoginRef = useRef(); // Reference to KakaoLogin component
  const googleLoginRef = useRef();

  const navigate = useNavigate();

  const onEmailHandler = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  const handleSocialLogin = (provider) => {
    switch (provider) {
      case "google":
        googleLoginRef.current.triggerGoogleLogin();
        break;
      case "kakao":
        kakaoLoginRef.current.loginWithKakao();
        break;
      default:
        break;
    }
  };

  // 로그인 요청 핸들러
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        // 로그인 성공 시
        setLoginCheck(false);
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("email", response.data.email); // 이메일 저장
        console.log("로그인 성공, 이메일 주소: " + response.data.email);
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
                <div className={`login_check ${loginCheck ? "visible" : ""}`}>
                  {loginCheck && (
                    <small>이메일 혹은 비밀번호를 확인해주세요.</small>
                  )}
                </div>
              </div>
            </div>

            <div>
              <button type="submit" className="login_btn">
                로그인
              </button>
            </div>
          </form>

          <div className="social">
            <button onClick={() => handleSocialLogin("google")}>
              <img src={google} alt="구글"></img>
            </button>

            <button onClick={() => handleSocialLogin("kakao")}>
              <img src={kakao} alt="카카오"></img>
            </button>

            {/* 네이버 미완성 */}
            <button>
              <img src={naver} alt="네이버"></img>
            </button>
          </div>
        </div>
        <KakaoLogin ref={kakaoLoginRef} />
        <GoogleLogin ref={googleLoginRef} />
      </div>
    </>
  );
};

export default Login;
