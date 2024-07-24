import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // 포트 번호 8080으로 설정
  withCredentials: true, // 세션 쿠키를 전송

  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`, // 인증 토큰 포함
  },
});

export default api;
