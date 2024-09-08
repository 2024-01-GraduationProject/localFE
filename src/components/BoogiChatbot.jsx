import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";

const BoogiChatbot = () => {
  const location = useLocation();
  const { userId, bookTitle, bookAuthor } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 책 완독 축하 메시지와 첫 질문을 가져옴
    api
      .get(`/boogi/ask-question/${userId}/${bookTitle}`)
      .then((response) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "boogi", text: response.data },
        ]);
      })
      .catch((error) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "boogi", text: "질문을 가져오는 중 오류가 발생했습니다." },
        ]);
      });
  }, [userId, bookTitle]);

  const handleSend = () => {
    if (userInput.trim() === "") return;

    // 사용자 입력 메시지 추가
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: userInput },
    ]);

    setLoading(true); // 로딩 상태 활성화

    // 답변 전송 후 챗봇 응답
    api
      .post("/boogi/answer", { userId, userAnswer: userInput, bookTitle })
      .then((response) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          //{ sender: "user", text: userInput },
          { sender: "boogi", text: response.data },
        ]);

        // 질문이 모두 끝난 경우 완료 상태로 설정
        if (response.data.includes("모두 마쳤어")) {
          setIsCompleted(true);
        }
      })
      .catch((error) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "boogi", text: "답변 처리 중 오류가 발생했습니다." },
        ]);
      })
      .finally(() => {
        setLoading(false); // 로딩 상태 비활성화
        setUserInput(""); // 입력 필드 초기화
      });
  };

  const handleNextQuestion = (response) => {
    setLoading(true); // 로딩 상태 활성화
    api
      .post("/boogi/next-question", { userId, response, bookTitle })
      .then((res) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "boogi", text: res.data },
        ]);

        if (res.data.includes("대화를 마칠게")) {
          setIsCompleted(true);
        }
      })

      .catch((error) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "boogi", text: "추가 질문 처리 중 오류가 발생했습니다." },
        ]);
      })
      .finally(() => {
        setLoading(false); // 로딩 상태 비활성화
      });
  };

  return (
    <>
      <div className="boogi-book-info">
        {"< "}
        {bookTitle} {" > "}| {bookAuthor}
      </div>
      <div className="chatbot-container-wrapper">
        <div className="chatbot-container">
          <div className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-bubble ${
                  message.sender === "boogi" ? "left" : "right"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          {!isCompleted && (
            <div className="input-container">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="답변을 입력하세요..."
                disabled={loading} // 로딩 중에는 입력 비활성화
              />
              <button onClick={handleSend} disabled={loading}>
                {loading ? "전송 중..." : "전송"}
              </button>
            </div>
          )}
          {!isCompleted && (
            <div className="next-question-buttons">
              <button
                onClick={() => handleNextQuestion("YES")}
                disabled={loading}
              >
                예
              </button>
              <button
                onClick={() => handleNextQuestion("NO")}
                disabled={loading}
              >
                아니오
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BoogiChatbot;
