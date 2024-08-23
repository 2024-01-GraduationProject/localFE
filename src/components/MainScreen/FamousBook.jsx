import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "AuthContext";
const FamousBook = () => {
  const [books, setBooks] = useState([]); // 추천 책 목록 상태
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
  const booksPerPage = 4; // 페이지당 표시할 책 수
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // 로그인 페이지로 리다이렉트
      return;
    }

    const fetchUserData = async () => {
      try {
        // API 호출
        const response = await api.get("/user-data", {});

        // 사용자 데이터 설정
        setUserData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendedBooks = async () => {
      try {
        // 연령대 및 성별 정보 없이 추천 도서 가져오기
        const booksResponse = await api.get("/recommend/ageAndGender");

        setBooks(booksResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchRecommendedBooks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { age, gender } = userData;

  // 현재 페이지의 책들 가져오기
  const currentBooks = books.slice(
    currentPage * booksPerPage,
    (currentPage + 1) * booksPerPage
  );

  // 페이지 네비게이션
  const nextPage = () => {
    if ((currentPage + 1) * booksPerPage < books.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToBookDetail = (id) => {
    navigate(`/books/details/${id}`);
  };

  return (
    <>
      <div className="main-booklist-component">
        요즘 <strong>{age}</strong> <strong>{gender}</strong>이(가) 많이 보는 책{" "}
      </div>
      <div className="book-list-wrapper">
        <button
          className="pagebtn"
          onClick={prevPage}
          disabled={currentPage === 0}
        >
          {"<"}
        </button>
        <div className="book-list">
          {currentBooks.map((book) => (
            <div
              key={book.bookId}
              className="book-item"
              onClick={() => goToBookDetail(book.bookId)}
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
          ))}
        </div>
        <button
          className="pagebtn"
          onClick={nextPage}
          disabled={(currentPage + 1) * booksPerPage >= books.length}
        >
          {">"}
        </button>
      </div>
    </>
  );
};

export default FamousBook;
