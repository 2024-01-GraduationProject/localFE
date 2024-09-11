import React from "react";
import ReactDOM from "react-dom/client";
import "index.css";
import "assets/scss/style.scss";
import App from "./App";

const originalConsoleError = console.error;

console.error = (...args) => {
  if (args[0]?.includes("ResizeObserver loop limit exceeded")) {
    return; // 특정 에러 메시지를 무시
  }
  originalConsoleError(...args); // 다른 에러는 그대로 출력
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
