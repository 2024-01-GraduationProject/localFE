import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header2, MainNav, SearchBar } from "components";
import api from "../../api";

const BookCategory = () => {
  const { categoryName } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooksByCategory = async () => {
      try {
        // 백엔드에서 해당 카테고리의 책 목록을 가져옵니다.
        const booksResponse = await api.get(`/books/category/${categoryName}`);
        if (booksResponse.status !== 200) {
          throw new Error(
            `Network response was not ok. Status: ${booksResponse.status}`
          );
        }
        setBooks(booksResponse.data); // 가져온 데이터를 상태에 저장합니다.
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksByCategory(); // 컴포넌트가 마운트되면 API를 호출합니다.
  }, [categoryName]); // categoryName이 변경될 때마다 데이터를 다시 가져옵니다.

  const goToBookDetail = (id) => {
    navigate(`/books/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading books: {error.message}</p>;

  return (
    <>
      <Header2 />
      <SearchBar />
      <MainNav />
      <div className="bookCG-list-wrapper">
        <h2>{categoryName}</h2>
        <div className="bookCG-list">
          {books.length === 0 ? (
            <p>No books found in this category.</p>
          ) : (
            books.map((book) => (
              <div
                key={book.id}
                className="bookCG-item"
                onClick={() => goToBookDetail(book.id)}
              >
                <img
                  src={book.coverImageUrl}
                  alt={`Cover of ${book.title}`}
                  className="book-cover"
                />
                <div className="bookCG-details">
                  <h2 className="bookCG-title">{book.title}</h2>
                  <p className="bookCG-author">
                    {book.author} | {book.publisher}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default BookCategory;
