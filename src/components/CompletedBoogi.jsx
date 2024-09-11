import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api"; // API 호출용 설정 파일
import boogi2 from "assets/img/boogi2.jpg";
import { FaRegArrowAltCircleLeft } from "react-icons/fa"; // 아이콘 임포트

const CompletedBoogi = () => {
  const { userId, bookId } = useParams();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookTitle, setBookTitle] = useState(""); // 책 제목 상태
  const [bookAuthor, setBookAuthor] = useState(""); // 책 저자 상태
  const navigate = useNavigate();
  useEffect(() => {
    // 사용자 답변 조회 API 호출
    api
      .get(`/boogi/answers/${userId}/${bookId}`)
      .then((response) => {
        // "" 따옴표 안의 내용을 제거하는 함수
        const filterQuotedContent = (text) => {
          return text.replace(/".*?"/g, ""); // 따옴표 안의 내용 제거
        };

        // 답변 데이터를 필터링하여 상태 업데이트
        const filteredAnswers = response.data.map((answer) => ({
          ...answer,
          answer: filterQuotedContent(answer.answer),
        }));

        setAnswers(filteredAnswers);
        setLoading(false); // 로딩 완료 상태로 변경
      })
      .catch((error) => {
        setError(
          error.response?.data?.message ||
            "답변을 가져오는 중 오류가 발생했습니다."
        );
        setLoading(false); // 로딩 실패 상태로 변경
      });

    // 책 정보 조회 API 호출
    api
      .get(`/books/${bookId}`)
      .then((response) => {
        setBookTitle(response.data.title); // 책 제목 설정
        setBookAuthor(response.data.author); // 책 저자 설정
      })
      .catch((error) => {
        setError(
          error.response?.data?.message ||
            "책 정보를 가져오는 중 오류가 발생했습니다."
        );
      });
  }, [userId, bookId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류 발생: {error}</div>;
  }

  return (
    <>
      <div className="boogi-book-info">
        {"< "}
        {bookTitle} {" > "}| {bookAuthor}
      </div>
      <button className="back-button" onClick={handleBack}>
        <FaRegArrowAltCircleLeft />
      </button>
      <div className="chatbot-container-wrapper">
        <div className="chatbot-container">
          <div className="messages">
            {answers.length > 0 ? (
              answers.map((answer, index) => (
                <React.Fragment key={index}>
                  {answer.question && (
                    <div className="message-bubble left">
                      <img
                        src={boogi2}
                        alt="chatbot_boogi"
                        className="chatbot_profile"
                      />
                      <div className="message-text">{answer.question}</div>
                    </div>
                  )}
                  {answer.answer && (
                    <div className="message-bubble right">
                      <div className="message-text">{answer.answer}</div>
                    </div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div>답변 기록이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompletedBoogi;
