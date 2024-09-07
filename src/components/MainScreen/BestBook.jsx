import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "AuthContext";
import api from "../../api";

const BestBook = () => {
  const [bestBooks, setBestBooks] = useState([]);
  const [books, setBooks] = useState([]); // 추천 책 목록 상태
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지를 저장하는 상태
  const booksPerPage = 4; // 한 번에 보여줄 책의 수
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // 로그인 페이지로 리다이렉트
      return;
    }
    const fetchBestBooks = async () => {
      try {
        // 추천 도서 가져오기
        const booksResponse = await api.get("/recommend/bestbooks");
        const selectedBooks = booksResponse.data;
        setBooks(selectedBooks);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestBooks();
  }, [isAuthenticated, navigate]);

  // 현재 페이지의 책들을 가져옴
  const currentBooks = bestBooks.slice(
    currentPage * booksPerPage,
    (currentPage + 1) * booksPerPage
  );

  // 다음 페이지로 이동
  const nextPage = () => {
    if ((currentPage + 1) * booksPerPage < bestBooks.length) {
      setCurrentPage(1); // 페이지를 1로 변경하여 나머지 4권을 표시
    }
  };

  // 이전 페이지로 이동
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(0); // 페이지를 0으로 변경하여 첫 4권을 다시 표시
    }
  };

  const goToBookDetail = (id) => {
    navigate(`/books/details/${id}`);
  };

  return (
    <div>
      <div className="main-booklist-component">
        <strong>Best</strong> 도서
      </div>
      <div className="bestBook-list-wrapper">
        <button
          className="pagebtn"
          onClick={prevPage}
          disabled={currentPage === 0}
        >
          {"<"}
        </button>
        <div className="book-list">
          {currentBooks.length > 0 ? (
            currentBooks.map((book) => (
              <div
                key={book.id}
                className="bestbook-item"
                onClick={() => goToBookDetail(book.id)}
              >
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="book-cover"
                />
                <div className="book-details">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">
                    {book.author} | {book.publisher}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>베스트 도서 준비 중!</p>
          )}
        </div>
        <button
          className="pagebtn"
          onClick={nextPage}
          disabled={(currentPage + 1) * booksPerPage >= bestBooks.length}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default BestBook;
