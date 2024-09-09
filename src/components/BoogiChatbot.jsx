import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import api from "../api";

const BoogiChatbot = () => {
  const { bookId } = useParams();
  const location = useLocation();
  const { userId, bookTitle, bookAuthor } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const encodedBookTitle = encodeURIComponent(bookTitle);
    // 책 완독 축하 메시지와 첫 질문을 가져옴
    api
      .get(`/boogi/ask-question/${userId}/${encodedBookTitle}`)
      .then((response) => {
        console.log(response.data); // 데이터 구조 확인용

        // 응답이 문자열인지 배열인지 확인
        if (Array.isArray(response.data)) {
          const messagesArray = response.data.map((item) => ({
            sender: "boogi",
            text: item, // item은 배열의 각 요소 (질문 텍스트 등)
          }));
          setMessages((prevMessages) => [...prevMessages, ...messagesArray]);
        } else {
          // 응답이 문자열일 경우 처리
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "boogi", text: response.data },
          ]);
        }
      })
      .catch((error) => {
        console.error("Error response:", error.response.data);
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
      .post("/boogi/answer", userInput, {
        params: {
          userId,
          bookTitle,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // 응답이 배열이므로, 각 항목을 메시지로 추가
        const messagesArray = response.data.split("\n").map((item, index) => ({
          sender: "boogi",
          text: item,
        }));
        setMessages((prevMessages) => [...prevMessages, ...messagesArray]);

        // 질문이 모두 끝난 경우 완료 상태로 설정
        if (response.data.some((message) => message.includes("모두 마쳤어"))) {
          setIsCompleted(true);
        }
      })
      .catch((error) => {
        console.error("Error response:", error.response.data);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "boogi", text: "답변 처리 중 오류가 발생했습니다." },
        ]);
      })
      .finally(() => {
        // 사용자 답변을 DB에 저장
        api
          .post("/boogi/save-answer", {
            userId,
            bookId,
            answer: userInput,
          })
          .then((response) => {
            console.log(response.data); // 저장 성공 메시지
          })
          .catch((error) => {
            console.error("Error saving answer:", error.response.data);
          })
          .finally(() => {
            setLoading(false); // 로딩 상태 비활성화
            setUserInput(""); // 입력 필드 초기화
          });
      });
  };

  const handleNextQuestion = (response) => {
    setLoading(true); // 로딩 상태 활성화
    api
      .post("/boogi/next-question", null, {
        params: {
          userId,
          response,
          bookTitle,
        },
      })
      .then((res) => {
        // 응답이 배열이므로, 각 항목을 메시지로 추가
        const messagesArray = res.data.split("\n").map((item, index) => ({
          sender: "boogi",
          text: item,
        }));
        setMessages((prevMessages) => [...prevMessages, ...messagesArray]);

        if (res.data.some((message) => message.includes("대화를 마칠게"))) {
          setIsCompleted(true);
        }
      })

      .catch((error) => {
        console.error("Error response:", error.response.data);
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
