import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header2 } from "components";
import boogi2 from "assets/img/boogi2.jpg";
import { useAuth } from "AuthContext";
import api from "../../api";

const TasteNext = () => {
  const navigate = useNavigate();
  /* eslint-disable no-unused-vars */
  const { authToken, login } = useAuth();

  const location = useLocation();
  const { email, password } = location.state || {}; // Join 컴포넌트에서 전달된 email과 password

  // 로딩 상태 관리
  const [loading, setLoading] = useState(true);
  const [loginSuccessful, setLoginSuccessful] = useState(false);

  useEffect(() => {
    const handleNavigate = async () => {
      try {
        if (!email || !password) {
          throw new Error("이메일과 비밀번호가 필요합니다.");
        }

        // 로그인 API 호출
        const response = await api.post("/login", { email, password });

        if (response.status === 200) {
          // 로그인 성공 시
          const { token } = response.data;
          localStorage.setItem("authToken", token);
          login(token);
          setLoginSuccessful(true);
        } else {
          throw new Error("로그인 실패");
        }
      } catch (error) {
        console.error("로그인 실패:", error);
        alert("로그인 중 문제가 발생했습니다.");
        navigate("/login"); // 로그인 화면으로 이동
      } finally {
        setLoading(false); // 로그인 시도 후 로딩 상태를 false로 변경
      }
    };

    handleNavigate(); // 페이지 로드 시 자동 로그인 시도
  }, [email, password, login, navigate]);

  // 로딩 중일 때 로딩 메시지 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <Header2 />
      <div id="tastenext">
        <img src={boogi2} alt="부기"></img>
        <div className="taste_text">
          <div>감사합니다!</div>
          <div>부기가 취향에 맞는 도서를 소개해드릴게요!</div>
        </div>

        {loginSuccessful ? (
          <button className="move_home" onClick={() => navigate("/mainview")}>
            홈으로 이동하기
          </button>
        ) : (
          <div>로그인 실패. 다시 시도해주세요.</div>
        )}
      </div>
    </>
  );
};

export default TasteNext;
