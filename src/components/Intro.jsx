import React, { useState, useRef } from "react";
import google from "assets/img/ico/google.ico";
import kakao from "assets/img/ico/kakaotalk.ico";
import naver from "assets/img/ico/naver.ico";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Axios 인스턴스 import
import KakaoLogin from "../routes/Login/KakaoLogin";
import GoogleLogin from "../routes/Login/GoogleLogin";
import NaverLogin from "../routes/Login/NaverLogin";

const Intro = () => {
  // 입력한 이메일 값 저장
  const [introEmail, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailAvailable, setIsEmailAvailable] = useState(false); // 이메일 사용 가능 여부

  const navigate = useNavigate();

  const kakaoLoginRef = useRef(); // Reference to KakaoLogin component
  const googleLoginRef = useRef();

  const onChangeEmail = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    emailCheckHandler(emailValue);
  };

  // 이메일 유효성, 중복 검사 핸들러
  const emailCheckHandler = async (email) => {
    const emailRegex =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (email === "") {
      setEmailError("이메일을 입력해주세요.");
      setIsEmailAvailable(false);
    } else if (!emailRegex.test(email)) {
      setEmailError("이메일 형식으로 입력해주세요.");
      setIsEmailAvailable(false);
    } else {
      // 이메일 중복 확인 API 호출
      try {
        const response = await api.post("/validate-email", { email });

        if (response.data.isDuplicate) {
          setEmailError("이미 사용 중인 이메일입니다.");
          setIsEmailAvailable(false);
        } else {
          setEmailError("사용 가능한 이메일입니다.");
          setIsEmailAvailable(true);
        }
      } catch (error) {
        console.error("Error checking email: ", error);
        setEmailError(
          "이메일 중복 확인 중 오류가 발생했습니다. 관리자에게 문의해주세요."
        );
        setIsEmailAvailable(false);
      }
    }
  };

  const handleStartClick = () => {
    if (introEmail) {
      navigate("/join", { state: { email: introEmail } });
    }
  };

  const handleSocialLogin = (provider) => {
    switch (provider) {
      case "google":
        googleLoginRef.current.triggerGoogleLogin();
        break;
      case "kakao":
        kakaoLoginRef.current.loginWithKakao();
        break;
      case "naver":
        navigate("/login/naver");
        break;
      default:
        break;
    }
  };

  /*const openNaverLoginPopup = () => {
    const popup = window.open(
      "/login/naver",
      "naverLoginPopup",
      "width=350,height=400"
    );
    if (popup) {
      popup.focus();
    } else {
      console.error("팝업 차단됨 - 네이버 로그인 팝업을 열 수 없습니다.");
      // 팝업이 차단된 경우 대체할 수 있는 처리 추가
    }
  }; */

  return (
    <section id="intro">
      <div className="intro__text">
        <div className="text1"> 오래도록 책을 마음에 두고 싶다면? </div>
        <div className="text2">
          <span className="boogi_text">부기</span>와 함께 밀도있는 독서생활,
        </div>
        <div className="text3">
          <span className="boogi_text">AI 부기</span>가 책에 대한 여러 질문을
          던져줍니다!
        </div>
      </div>
      <form className="intro__start" onSubmit={(e) => e.preventDefault()}>
        <div className="intro__input">
          <input
            type="text"
            placeholder="e-mail"
            value={introEmail}
            onChange={onChangeEmail}
          />

          {emailError && (
            <div
              className={`error-message ${
                emailError === "사용 가능한 이메일입니다." ? "success" : ""
              }`}
            >
              {emailError}
            </div>
          )}
        </div>

        <button
          className={`start_btn ${isEmailAvailable ? "active" : "inactive"}`}
          disabled={!isEmailAvailable}
          onClick={handleStartClick}
        >
          첫 달 무료로 시작하기
        </button>
      </form>
      <div className="social_join">
        <div>OR</div>
        {/* 간편로그인 연결 미완성 */}
        <div className="social">
          <button onClick={() => handleSocialLogin("google")}>
            <img src={google} alt="구글"></img>
          </button>

          <button onClick={() => handleSocialLogin("kakao")}>
            <img src={kakao} alt="카카오"></img>
          </button>
          <button onClick={() => handleSocialLogin("naver")}>
            <img src={naver} alt="네이버"></img>
          </button>
        </div>
      </div>
      <KakaoLogin ref={kakaoLoginRef} /> {/* Include KakaoLogin component */}
      <GoogleLogin ref={googleLoginRef} />
    </section>
  );
};

export default Intro;
