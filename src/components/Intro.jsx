import React, { useState, useRef } from "react";
import google from "assets/img/ico/google.ico";
import kakao from "assets/img/ico/kakaotalk.ico";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Axios 인스턴스 import
import KakaoLogin from "../routes/Login/KakaoLogin";
import GoogleLogin from "../routes/Login/GoogleLogin";
import { debounce } from "lodash"; // 사용자 입력이 자주 발생할 경우 API 호출 최적화

const Intro = () => {
  const [introEmail, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  const navigate = useNavigate();

  const kakaoLoginRef = useRef(null); // Reference to KakaoLogin component
  const googleLoginRef = useRef(null);

  const onChangeEmail = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    emailCheckHandler(emailValue);
  };

  const emailCheckHandler = debounce(async (email) => {
    const emailRegex =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (email === "") {
      setEmailError("이메일을 입력해주세요.");
      setIsEmailAvailable(false);
    } else if (!emailRegex.test(email)) {
      setEmailError("이메일 형식으로 입력해주세요.");
      setIsEmailAvailable(false);
    } else {
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
        console.error("Error checking email:", error);
        setEmailError(
          "이메일 중복 확인 중 오류가 발생했습니다. 관리자에게 문의해주세요."
        );
        setIsEmailAvailable(false);
      }
    }
  }, 300);

  const handleStartClick = () => {
    if (introEmail) {
      navigate("/join", { state: { value: introEmail } });
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
      default:
        break;
    }
  };

  return (
    <section id="intro">
      <div className="intro__text">
        <div className="text1">오래도록 책을 마음에 두고 싶다면?</div>
        <div className="text2">
          <span className="boogi_text">부기</span>와 함께 밀도있는 독서생활,
        </div>
        <div className="text3">
          <span className="boogi_text">AI 부기</span>가 책에 대한 여러 질문을
          던져줍니다!
        </div>
      </div>
      <form
        className="intro__start"
        onSubmit={(e) => {
          e.preventDefault();
          handleStartClick();
        }}
      >
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

        <div className="social">
          <button onClick={() => handleSocialLogin("google")}>
            <img src={google} alt="구글" />
          </button>

          <button onClick={() => handleSocialLogin("kakao")}>
            <img src={kakao} alt="카카오" />
          </button>
        </div>
      </div>
      <KakaoLogin ref={kakaoLoginRef} />
      <GoogleLogin ref={googleLoginRef} />
    </section>
  );
};

export default Intro;
