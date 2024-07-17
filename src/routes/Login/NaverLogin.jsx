import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const NaverLogin = () => {
  const NAVER_CLIENT_ID = "VnpNuynPzFUnHoT5UCYP";
  const NAVER_CALLBACK_URL = "http://localhost:3000/login/naver";
  const navigate = useNavigate();

  useEffect(() => {
    const initializeNaver = () => {
      if (!window.naver) {
        console.error("네이버 SDK가 로드되지 않았습니다.");
        return;
      }

      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: NAVER_CLIENT_ID,
        callbackUrl: NAVER_CALLBACK_URL,
        isPopup: false,
        callbackHandle: true,
      });
      naverLogin.init();

      const naverSignInCallback = () => {
        naverLogin.getLoginStatus(async (status) => {
          if (status) {
            const user = naverLogin.user;
            console.log("Naver user:", user);
            // 서버로 naverLogin.user 정보를 전송 후 인증 및 사용자 정보 획득
            try {
              const response = await api.post("/auth/naver", { id: user.id });
              const data = await response.json();
              if (response.data.isNewUser) {
                navigate("/taste"); // 처음 이용자
              } else {
                navigate("/mainview"); // 기존 이용자
              }
            } catch (error) {
              console.error("서버 통신 오류:", error);
            }
          } else {
            console.error("로그인 상태 확인 실패");
          }
        });
      };

      window.addEventListener("load", naverSignInCallback);

      return () => {
        window.removeEventListener("load", naverSignInCallback);
      };
    };

    // 네이버 SDK (nopolyfill 버전) 로드
    const script = document.createElement("script");
    script.src =
      "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2-nopolyfill.js";
    script.onload = () => {
      console.log("네이버 SDK (nopolyfill 버전)가 로드되었습니다.");
      initializeNaver();
    };
    script.onerror = () => {
      console.error("네이버 SDK (nopolyfill 버전) 로드 실패");
    };
    document.body.appendChild(script);

    return () => {
      window.removeEventListener("load", initializeNaver);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [navigate]);

  return <div id="naverIdLogin"></div>;
};

export default NaverLogin;
