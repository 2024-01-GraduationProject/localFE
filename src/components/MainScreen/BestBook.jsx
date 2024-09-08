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
        const booksResponse = await api.get("/books/best");
        const bestBooks = booksResponse.data;
        setBooks(bestBooks);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestBooks();
  }, [isAuthenticated, navigate]);

  const goToBookDetail = (id) => {
    navigate(`/books/details/${id}`);
  };

  return (
    <div>
      <div className="main-booklist-component">
        <strong>Best</strong> 도서
      </div>
      <div className="bestBook-list-wrapper">
        <div className="book-list">
          {books.length > 0 ? (
            books.map((book) => (
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
      </div>
    </div>
  );
};

export default BestBook;
