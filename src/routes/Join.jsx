import React, { useState, useEffect } from "react";
import logo from "assets/img/logo.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Join = () => {
  const navigate = useNavigate();
  // Intro에서 입력한 이메일 값 받아오기
  const { state } = useLocation();

  // 이메일, 패스워드 상태 설정
  const [email, setEmail] = useState(state.value);
  const [password, setPw] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPwError] = useState("");

  const [isEmailAvailable, setIsEmailAvailable] = useState(false); // 이메일 사용 가능 여부

  // 이용약관 상태초기화
  const [allAgreed, setAllAgreed] = useState(false);
  const [agreements, setAgreements] = useState({
    personalInfo: false,
    eventAlarm: false,
  });

  // 버튼 활성화 상태 설정
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  useEffect(() => {
    const isEmailValid = isEmailAvailable;
    const isPasswordValid = passwordError === "";
    const isAgreementValid = agreements.personalInfo;

    setIsButtonEnabled(isEmailValid && isPasswordValid && isAgreementValid);
  }, [isEmailAvailable, passwordError, agreements]);

  // onChangeHandler - 사용자가 input 값 입력할 때마다 변화 감지 및 업데이트
  const onChangeEmailHandler = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    emailCheckHandler(emailValue);
  };

  const onChangePwHandler = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPw(value);
      passwordCheckHandler(value);
    } else {
      passwordCheckHandler(password);
    }
  };

  // 이메일 유효성, 중복 검사 핸들러
  const emailCheckHandler = async (email) => {
    const emailRegex =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    ///^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
    if (email === "") {
      setEmailError("이메일을 입력해주세요.");
      setIsEmailAvailable(false);
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("이메일 형식으로 입력해주세요.");
      setIsEmailAvailable(false);
      return false;
    } else {
      // 이메일 중복 확인 API 호출
      try {
        const response = await fetch("/api/check-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();

        if (data.isDuplicate) {
          setEmailError("이미 사용 중인 이메일입니다.");
          setIsEmailAvailable(false);
        } else {
          setEmailError("사용 가능한 이메일입니다.");
          setIsEmailAvailable(true);
        }
      } catch (error) {
        setEmailError(
          "이메일 중복 확인 중 오류가 발생했습니다. 관리자에게 문의해주세요."
        );
        setIsEmailAvailable(false);
      }
    }
  };

  // 패스워드 유효성, 중복 검사 핸들러
  const passwordCheckHandler = (password) => {
    const passwordRegx = /^(?=.*[a-zA-Z])(?=.*[!@$&-_])(?=.*[0-9]).{8,16}$/;
    if (password === "") {
      setPwError("비밀번호를 입력해주세요.");
      return false;
    } else if (!passwordRegx.test(password)) {
      setPwError(
        "비밀번호는 8~16자리 영문 대소문자 + 숫자 + ! @ $ & - _ 조합으로 입력해주세요."
      );
      return false;
    } else {
      setPwError("");
      return true;
    }
  };

  // 이용약관 이벤트 핸들러
  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;

    setAgreements((preAgreements) => ({ ...preAgreements, [name]: checked }));
    const allChecked = Object.values({ ...agreements, [name]: checked }).every(
      (value) => value === true
    );
    setAllAgreed(allChecked);
  };

  const handleAllAgreementChange = (e) => {
    const { checked } = e.target;
    setAgreements((preAgreements) =>
      Object.keys(preAgreements).reduce(
        (newAgreements, agreementKey) => ({
          ...newAgreements,
          [agreementKey]: checked,
        }),
        {}
      )
    );
    setAllAgreed(checked);
  };

  // 대충 만들어본 것. 근데 프론트 범위가 아닌 듯?

  // 회원가입 요청 핸들러
  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailAvailable) {
      setEmailError("이메일을 확인해주세요.");
      return;
    }
    if (passwordCheckHandler(password)) {
      try {
        const response = await fetch("/api/join", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, agreements }),
        });
        if (response.ok) {
          alert("회원가입이 완료되었습니다.");
          navigate("/MainView");
        } else {
          const errorData = await response.json();
          alert(`회원가입 실패: ${errorData.message}`);
        }
      } catch (error) {
        alert("회원가입 중 오류가 발생했습니다.");
      }
    } else {
      setPwError("비밀번호를 확인해주세요.");
    }
  };

  return (
    <>
      <div id="join">
        <span>
          <img src={logo} alt="로고"></img>
        </span>

        <form className="join_form" onSubmit={handleJoinSubmit}>
          <div>
            <div className="join_input">
              <input
                onChange={onChangeEmailHandler}
                className="join_email"
                type="email"
                name="email"
                value={email}
                placeholder="사용자 이메일"
                autoFocus
              />
              {emailError && (
                <small className={isEmailAvailable ? "emailAvailable" : ""}>
                  * {emailError}
                </small>
              )}
              <input
                onChange={onChangePwHandler}
                className="join_pw"
                type="password"
                name="password"
                placeholder="비밀번호"
              />
              {passwordError && <small>* {passwordError}</small>}
            </div>
          </div>

          <div className="check_agree">
            <ul>
              <li>
                <input
                  type="checkbox"
                  id="agree_check_info"
                  name="personalInfo"
                  required
                  checked={agreements.personalInfo}
                  onChange={handleAgreementChange}
                />
                <label htmlFor="agree_check_info">
                  [필수] 개인정보 이용 수집 방침
                </label>
              </li>

              <li>
                <input
                  type="checkbox"
                  id="agree_check_event_receive"
                  name="eventAlarm"
                  checked={agreements.eventAlarm}
                  onChange={handleAgreementChange}
                />
                <label htmlFor="agree_check_event_receive">
                  [선택] 이벤트 및 혜택 알림 수신 동의
                </label>
              </li>

              <li>
                <input
                  type="checkbox"
                  id="agree_check_all"
                  name="agree_check_all"
                  checked={allAgreed}
                  onChange={handleAllAgreementChange}
                />
                <label htmlFor="agree_check_all">이용약관 전체동의</label>
              </li>
            </ul>
          </div>

          <div>
            <Link to="/taste">
              <button
                type="submit"
                className={isButtonEnabled ? "active_btn" : "agree_btn"}
                disabled={!isButtonEnabled}
              >
                동의하고 계속
              </button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Join;
