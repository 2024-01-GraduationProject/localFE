import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header2, MainNav, SearchBar } from "components";
import api from "../../api";

const BookCategory = ({ categoryName }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooksByCategory = async () => {
      try {
        // category data 가져오기
        const categoryResponse = await api.get("/categories");
        if (categoryResponse.status !== 200) {
          throw new Error(
            `Network response was not ok. Status: ${categoryResponse.status}`
          );
        }
        const categoryData = categoryResponse.data;

        // 지정된 카테고리 이름의 category_id를 찾음
        const category = categoryData.find(
          (cat) => cat.category === categoryName
        );
        if (!category) {
          throw new Error(`Category '${categoryName}' not found.`);
        }

        // 책 목록 가져와서 category_id로 필터링

        const booksResponse = await api.get("/books");
        if (booksResponse.status !== 200) {
          throw new Error(
            `Network response was not ok. Status: ${booksResponse.status}`
          );
        }
        const booksData = booksResponse.data;

        if (Array.isArray(booksData)) {
          const categoryBooks = booksData.filter(
            (book) => book.category === categoryName
          );
          setBooks(categoryBooks);
        } else {
          throw new Error("Unexpected data format.");
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksByCategory();
  }, [categoryName]);

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
                key={book.book_id}
                className="bookCG-item"
                onClick={() => goToBookDetail(book.book_id)}
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
