import React, { useEffect, useImperativeHandle, forwardRef } from "react";

const KakaoLogin = forwardRef((props, ref) => {
  useEffect(() => {
    const initializeKakao = () => {
      window.Kakao.init("6d03806f61f200a2887e981a772b8c1c"); // JavaScript 키를 사용해 카카오 SDK 초기화
    };

    // 카카오 스크립트 로드
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.onload = initializeKakao;
    document.body.appendChild(script);
  }, []);

  const loginWithKakao = () => {
    window.Kakao.Auth.login({
      success: (authObj) => {
        console.log(authObj);
        // 서버로 authObj.access_token 전송 후 인증 및 사용자 정보 획득
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
