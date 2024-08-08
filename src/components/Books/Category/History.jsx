import React, { useEffect, useState } from "react";
import { Header2, MainNav, SearchBar } from "components";
import api from "../../../api";

const History = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const historyBooks = data.filter((book) => book.genre === "History");
        setBooks(historyBooks);
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
      <div>
        <h1>History Books</h1>
        {books.length === 0 ? (
          <p>No History books found.</p>
        ) : (
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <img src={book.coverImageUrl} alt={`Cover of ${book.title}`} />
                <h2>{book.title}</h2>
                <p>{book.author}</p>
                <p>{book.publisher}</p>
                <p>{book.publicationDate}</p>
                <p>{book.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default History;
