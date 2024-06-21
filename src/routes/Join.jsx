import Reaagree_check_infoct, { useState } from "react";
import logo from "../assets/img/logo.jpg";
import { Link, useLocation } from "react-router-dom";

const Join = () => {
  // Itro에서 입력한 이메일 값 받아오기
  const { state } = useLocation();

  // 이메일, 패스워드 상태 설정
  const [email, setEmail] = useState(state.value);
  const [password, setPw] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPwError] = useState("");

  const [isEmailCheck, setIsEmailCheck] = useState(false); // 중복 검사 여부
  const [isEmailAvailable, setIsEmailAvailable] = useState(false); // 이메일 사용 가능 여부

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
      setEmailError("사용 가능한 이메일입니다.");
      setIsEmailAvailable(true);
    }
    /*
    try {
      const responseData = await emailDuplicateCheck(email);
      if (responseData) {
        setEmailError("사용 가능한 이메일입니다.");
        setIsEmailCheck(true);
        setIsEmailAvailable(true);
        return true;
      } else {
        setEmailError("이미 사용 중인 이메일입니다.");
        setIsEmailAvailable(false);
        return false;
      }
    } catch (error) {
      alert("서버 오류입니다. 관리자에게 문의하세요.");
      console.error(error);
      return false;
    } */
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
  /*
  // 회원가입 요청 서버에 전송하는 핸들러
  const joinHandler = async (e) => {
    e.preventDefalut();

    const emailCheckresult = await emailCheckHandler(email);
    if (emailCheckresult) setEmailError("");
    else return;
    if (!isEmailCheck || !isEmailAvailable) {
      alert("이메일 중복 검사를 해주세요.");
      return;
    }

    const pwCheckResult = passwordCheckHandler(password, confirm);
    if (pwCheckResult) {
      setPwError("");
      setConfirmError("");
    } else return;

    try {
      const responseData = await join(email, password, confirm);
      if (responseData) {
        localStorage.setItem("loginEmail", email);
        setOpenModal(true);
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
      console.error(error);
    }
  }; */

  // 이용약관 상태초기화
  const [allAgreed, setAllAgreed] = useState(false);
  const [agreements, setAgreements] = useState({
    personalInfo: false,
    eventAlarm: false,
  });
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

  return (
    <>
      <div id="join">
        <span>
          <img src={logo} alt="로고"></img>
        </span>

        <form className="join_form">
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
                  id=""
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
              <button className="agree_btn">동의하고 계속</button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Join;
