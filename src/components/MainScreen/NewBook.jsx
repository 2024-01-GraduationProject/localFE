import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const NewBook = () => {
  const [books, setBooks] = useState([]); // 신간 8권 저장하는 상태
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지를 저장하는 상태
  const booksPerPage = 4; // 한 번에 보여줄 책의 수
  const navigate = useNavigate();

  useEffect(() => {
    // 컴포넌트가 마운트될 때 책 목록을 가져옴
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books");
        // 책 목록을 출판일 기준으로 내림차순 정렬
        const sortedBooks = response.data
          .sort(
            (a, b) => new Date(b.publicationDate) - new Date(a.publicationDate)
          )
          .slice(0, 8); // 상위 10권만 추출

        // 필요한 정보만 추출하여 상태에 저장
        const bookData = sortedBooks.map((book) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          coverImageUrl: book.coverImageUrl,
          publicationDate: book.publicationDate,
        }));
        setBooks(bookData);
      } catch (error) {
        console.error("Failed to fetch books", error);
      }
    };

    fetchBooks();
  }, []);

  // 현재 페이지의 책들을 가져옴
  const currentBooks = books.slice(
    currentPage * booksPerPage,
    (currentPage + 1) * booksPerPage
  );

  // 다음 페이지로 이동
  const nextPage = () => {
    if ((currentPage + 1) * booksPerPage < books.length) {
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
        <strong>New! </strong> 새로 들어온 책
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
              key={book.id}
              className="book-item"
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
    </div>
  );
};

export default NewBook;
