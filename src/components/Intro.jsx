import React, { useState } from "react";
import google from "assets/img/ico/google.ico";
import kakao from "assets/img/ico/kakaotalk.ico";
import naver from "assets/img/ico/naver.ico";
import { Link, useNavigate } from "react-router-dom";

const Intro = () => {
  // 입력한 이메일 값 저장
  const [introEmail, setEmail] = useState("");
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

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

      <form className="intro__start">
        <div className="intro__input">
          <input
            type="text"
            placeholder="e-mail"
            value={introEmail}
            onChange={onChangeEmail}
          />
        </div>
        <Link to={"/join"} state={{ value: introEmail }}>
          <button
            className={`start_btn ${introEmail ? "active" : "inactive"}`}
            disabled={!introEmail}
          >
            첫 달 무료로 시작하기
          </button>
        </Link>
      </form>

      <div className="social_join">
        <div>OR</div>
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
    </section>
  );
};

export default Intro;
