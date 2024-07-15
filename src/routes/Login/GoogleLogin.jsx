import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const GoogleLogin = () => {
  const navigate = useNavigate();

  // 컴포넌트 마운트될 때 구글 로그인 스크립트 load하고 초기화
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      // 구글 로그인 초기화하고 버튼 렌더링
      window.google.accounts.id.initialize({
        client_id:
          "491761230617-h5s1hn3v0mvispddsttmdvjuh2b4rc1i.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleLogin_button"),
        { theme: "outline", size: "large" }
      );
      window.google.accounts.id.prompt();
    };

    // 구글 로그인 성공 시 호출
    const handleCredentialResponse = async (response) => {
      console.log("Encoded JWT ID token: " + response.credential);

      try {
        const res = await api.post("/api/auth/google", {
          token: response.credential,
        });
        if (res.data.isNewUser) {
          navigate("/taste"); // 처음 이용자
        } else {
          navigate("/mainview"); // 기존 이용자
        }
      } catch (error) {
        console.error("Error sending token to server: ", error);
      }
    };

    // 구글 스크립트 로드
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);
  }, [navigate]);

  return (
    <div id="googleLogin">
      <div id="googleLogin_button"></div>
    </div>
  );
};

export default GoogleLogin;
