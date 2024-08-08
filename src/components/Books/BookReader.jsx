import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ePub from "epubjs";
import api from "../../api";

const BookReader = () => {
  const { book_id } = useParams();
  const bookRef = useRef(null);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${book_id}`);
        setBook(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [book_id]);

  useEffect(() => {
    if (book && book.content) {
      const bookInstance = ePub(book.content);
      const rendition = bookInstance.renderTo(bookRef.current, {
        width: "100%",
        height: "100%",
      });

      rendition.display();
    }
  }, [book]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div ref={bookRef} style={{ width: "100%", height: "600px" }}></div>;
};

export default BookReader;
