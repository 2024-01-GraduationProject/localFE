import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const GoogleLogin = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 컴포넌트 마운트될 때 구글 로그인 스크립트 load하고 초기화
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      // 구글 로그인 초기화하고 버튼 렌더링
      window.google.accounts.id.initialize({
        client_id:
          "491761230617-h5s1hn3v0mvispddsttmdvjuh2b4rc1i.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        cancel_on_tap_outside: false, // 로그인 창이 열릴 때 외부를 클릭하면 창이 닫히지 않도록 설정
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleLogin_button"),
        { theme: "outline", size: "large" }
      );
      //window.google.accounts.id.prompt();
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
      } finally {
        setIsLoggingIn(false);
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

  useImperativeHandle(ref, () => ({
    triggerGoogleLogin: () => {
      //window.google.accounts.id.prompt();
      if (!isLoggingIn) {
        setIsLoggingIn(true);
        window.google.accounts.id.prompt(); // 구글 One Tap 로그인 프롬프트 표시
      }
    },
  }));

  return <div id="googleLogin_button" style={{ display: "none" }}></div>;
});

export default GoogleLogin;
