import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header2 } from "components";
import api from "../../api";

const BookDetail = () => {
  const { book_id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    // 책 데이터 가져오는 함수
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${book_id}`);
        setBook(response.data);
        console.log(book);
      } catch (error) {
        console.error("${book_id} 책 데이터 가져오기 실패: ", error);
      }
    };

    fetchBook();
  }, [book_id]);

  if (!book) return <p>Loading...</p>;

  return (
    <>
      <Header2 />

      <div id="book-detail">
        <div className="book-cover">
          <img src={book.coverImageUrl} alt={`${book.title} cover`} />
        </div>

        <div className="book-info">
          <h1>{book.title}</h1>
          <p>저자: {book.author}</p>
          <p>출판사: {book.publisher}</p>
          <p>출간일: {book.publicationDate}</p>
          <p>장르: {book.genre}</p>
          <p>요약: {book.summary}</p>
        </div>
      </div>
    </>
  );
};

export default BookDetail;
