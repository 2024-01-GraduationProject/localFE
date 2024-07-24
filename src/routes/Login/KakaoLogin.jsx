import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const KakaoLogin = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const KAKAO_CLIENT_ID = "6d03806f61f200a2887e981a772b8c1c";

  useEffect(() => {
    const initializeKakao = () => {
      window.Kakao.init(KAKAO_CLIENT_ID); // JavaScript 키를 사용해 카카오 SDK 초기화
    };

    // 카카오 스크립트 로드
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.onload = initializeKakao;
    document.body.appendChild(script);
  }, []);

  const sendTokenToServer = async (token) => {
    try {
      const response = await api.post("/auth/kakao", { access_token: token });
      console.log(response.data);
      if (response.data.isNewUser) {
        navigate("/taste"); // 처음 이용자
      } else {
        navigate("/mainview"); // 기존 이용자
      }
    } catch (error) {
      console.error("Error sending token to server:", error);
    }
  };

  const loginWithKakao = () => {
    window.Kakao.Auth.login({
      success: (authObj) => {
        console.log(authObj);
        sendTokenToServer(authObj.access_token); // 서버로 토큰 전송
      },
      fail: (err) => {
        console.error(err);
      },
    });
  };
  useImperativeHandle(ref, () => ({
    loginWithKakao,
  }));
  return null;
});

export default KakaoLogin;
