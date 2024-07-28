import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header2 } from "components";
import boogi2 from "assets/img/boogi2.jpg";
import useAuth from "routes/Login/UseAuth";
import api from "../../api";

const TasteNext = () => {
  const navigate = useNavigate();

  useAuth();

  const location = useLocation();
  const { email, password } = location.state || {}; // Join 컴포넌트에서 전달된 email과 password

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
        localStorage.setItem("authToken", token); // 토큰 저장
        navigate("/mainview"); // 메인뷰로 이동
      } else {
        throw new Error("로그인 실패");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 중 문제가 발생했습니다.");
      navigate("/login"); // 로그인 화면으로 이동
    }
  };

  useEffect(() => {
    handleNavigate(); // 페이지 로드 시 자동 로그인 시도
  }, []);

  return (
    <>
      <Header2 />
      <div id="tastenext">
        <img src={boogi2} alt="부기"></img>
        <div className="taste_text">
          <div>감사합니다!</div>
          <div>부기가 취향에 맞는 도서를 소개해드릴게요!</div>
        </div>

        <button className="move_home" onClick={handleNavigate}>
          홈으로 이동하기
        </button>
      </div>
    </>
  );
};

export default TasteNext;
