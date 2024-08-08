import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header2 } from "components";
import api from "../../api";

const BookDetail = () => {
  const { book_id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // 책 데이터 가져오는 함수
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${book_id}`);
        setBook(response.data);
        console.log(book);
        // 초기화: 사용자 즐겨찾기 여부 확인
        checkFavoriteStatus(response.data);
      } catch (error) {
        console.error("${book_id} 책 데이터 가져오기 실패: ", error);
      }
    };

    fetchBook();
  }, [book_id]);

  const checkFavoriteStatus = async (book) => {
    try {
      const response = await api.get(`/user/favorites/${book_id}`);
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error("My Facorite 상태 확인 실패: ", error);
    }
  };

  const handleDownload = async () => {
    try {
      // 책 다운로드 API 호출
      await api.post(`/books/${book_id}/download`);
      setIsDownloaded(true);
    } catch (error) {
      console.error(`${book_id} 책 다운로드 실패: `, error);
    }
  };

  const handleRead = () => {
    navigate(`/reader/${book_id}`);
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/user/favorites/${book_id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/user/favorites/${book_id}`);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("My Favorite 추가/제거 실패: ", error);
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <>
      <Header2 />

      <div id="book-detail">
        <div className="book-cover">
          <img src={book.coverImageUrl} alt={`${book.title} cover`} />
        </div>

        <div className="book-info">
          <div className="info-header">
            <h1>{book.title}</h1>
            <div className="book-actions">
              <button className="download-button" onClick={handleDownload}>
                다운로드
              </button>
              <button
                className={`favorite-button ${isFavorite ? "active" : ""}`}
                onClick={handleFavoriteToggle}
              >
                {isFavorite ? "❤️" : "🤍"}
              </button>
            </div>
          </div>

          <div className="info-item summary">
            <p>{book.summary}</p>
          </div>
          <div className="info-item author">
            <p>{book.author} 지음</p>
          </div>
          <div className="info-item publisher">
            <p>
              {book.category} | {book.publisher} | {book.publicationDate}
            </p>
          </div>
        </div>

        {isDownloaded && (
          <div className="read-button-container">
            <button className="read-button" onClick={handleRead}>
              바로 읽기
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BookDetail;
