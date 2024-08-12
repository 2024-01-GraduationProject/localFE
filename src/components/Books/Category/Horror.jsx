import React, { useState, useEffect } from "react";
import { Header2, MainNav, SearchBar } from "components";
import api from "../../../api";

const Horror = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books");
        if (response.status !== 200) {
          throw new Error(
            `Network response was not ok. Status: ${response.status}`
          );
        }
        const data = response.data;

        if (Array.isArray(data)) {
          const horrorBooks = data.filter((book) => book.category === "horror");
          setBooks(horrorBooks);
        } else {
          throw new Error("Unexpected data format.");
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading books: {error.message}</p>;

  return (
    <>
      <Header2 />
      <SearchBar />
      <MainNav />
      <div className="bookCG-list-wrapper">
        <h1>Horror Books</h1>
        <div className="bookCG-list">
          {books.length === 0 ? (
            <p>No horror books found.</p>
          ) : (
            books.map((book) => (
              <div key={book.book_id} className="bookCG-item">
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

export default Horror;
