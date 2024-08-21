import React, { useImperativeHandle, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const KakaoLogin = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
  const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

  const sendTokenToServer = async (code) => {
    try {
      const response = await api.post("/auth/kakao", { code });
      if (response.data.isNewUser) {
        navigate("/taste"); // 처음 이용자
      } else {
        navigate("/mainview"); // 기존 이용자
      }
    } catch (error) {
      console.error("Error sending code to server:", error);
    }
  };

  const handleKakaoLogin = () => {
    // 사용자 인증을 위해 Kakao 로그인 페이지로 리다이렉트
    window.location.href = KAKAO_AUTH_URI;
  };

  useImperativeHandle(ref, () => ({
    loginWithKakao: handleKakaoLogin,
  }));

  return null;
});

export default KakaoLogin;
