import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // 포트 번호 8080으로 설정
});

export default api;
