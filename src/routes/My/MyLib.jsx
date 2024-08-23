import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header2 from "components/Header/Header2";
import boogi2 from "assets/img/boogi2.jpg";
import api from "../../api"; // Axios 인스턴스 import
import { useAuth } from "AuthContext";

const MyLib = () => {
  const [activeTab, setActiveTab] = useState("책장");
  const [subTab, setSubTab] = useState("독서 중");
  const [readingBooks, setReadingBooks] = useState([]);
  const [completedBooks, setCompletedBooks] = useState([]);
  const [nickname, setNickname] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태
  const [selectedBooks, setSelectedBooks] = useState([]); // 선택된 책 목록

  const { isAuthenticated } = useAuth(); // 로그인 상태 가져오기
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 데이터 가져오기
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        navigate("/login"); // 로그인 페이지로 리다이렉트
        return;
      }

      try {
        // 닉네임 및 사용자 ID 가져오기
        const userDataResponse = await api.get("/user-data");
        const { userId, nickname } = userDataResponse.data;
        setNickname(nickname);
        setUserId(userId);
      } catch (error) {
        alert("사용자 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userId) return; // userId가 로드되지 않았으면 아무 작업도 하지 않음

    if (activeTab === "책장") {
      // "독서 중" 책과 "독서 완료" 책 가져오기
      const fetchBooks = async () => {
        try {
          const readingResponse = await api.get(
            `/bookshelf/reading?userId=${userId}`
          );

          /*const completedResponse = await api.get(
            "/bookshelf/completed?userId=${userId}"
          );*/

          // 독서 중인 책 중 status가 'READING'인 책만 필터링
          const readingBooksFiltered = readingResponse.data.filter(
            (userBook) => userBook.status === "READING"
          );

          /*독서 중인 책 중 status가 'COMPLETED'인 책만 필터링
          const completedBooksFiltered = readingResponse.data.filter(
            (userBook) => userBook.status === "COMPLETED"
          );*/

          // 독서 중인 책에 대한 추가 정보 가져오기
          const readingBooksWithDetails = await Promise.all(
            readingResponse.data.map(async (userBook) => {
              const bookDetailsResponse = await api.get(
                `/books/${userBook.bookId}`
              );
              const bookDetails = bookDetailsResponse.data;

              return {
                ...userBook,
                ...bookDetails,
                startDate: userBook.startDate, // 독서 중 시작 날짜
              };
            })
          );

          /*const completedBooksWithDetails = await Promise.all(
            completedResponse.data.map(async (userBook) => {
              const bookDetailsResponse = await api.get(
                `/books/${userBook.bookId}`
              );
              const bookDetails = bookDetailsResponse.data;

              return {
                ...userBook,
                ...bookDetails,
                endDate: userBook.endDate, // 독서 완료 종료 날짜
              };
            })
          );*/

          setReadingBooks(readingBooksWithDetails);
          //setCompletedBooks(completedResponse.data);
        } catch (error) {
          alert("책 데이터를 가져오는 중 오류가 발생했습니다.");
        }
      };

      fetchBooks();
    } else if (activeTab === "My Favorite") {
      // 즐겨찾기 목록 가져오기
      const fetchFavorites = async () => {
        try {
          // 즐겨찾기 목록을 가져오기
          const favoritesResponse = await api.get(
            `/bookmarks/list?userId=${userId}`
          );
          const favoriteBookIds = favoritesResponse.data.map(
            (favorite) => favorite.bookId
          );

          // 모든 책 목록을 가져와 userbookId를 생성하고, 해당 책이 즐겨찾기인지 확인
          const booksResponse = await api.get("/books");
          const allBooks = booksResponse.data;

          // 즐겨찾기 책 목록 필터링
          const favoriteBooks = allBooks.filter((book) =>
            favoriteBookIds.includes(book.bookId)
          );

          setFavorites(favoriteBooks);
        } catch (error) {
          alert("즐겨찾기 목록을 가져오는 중 오류가 발생했습니다.");
        }
      };

      fetchFavorites();
    }
  }, [activeTab, userId]);

  const handleBookClick = (bookId) => {
    navigate(`/books/details/${bookId}`); // 클릭된 책의 세부 페이지로 이동
  };

  // 편집 모드일 때 책 선택
  const handleSelectBook = (bookId) => {
    setSelectedBooks((prevSelected) =>
      prevSelected.includes(bookId)
        ? prevSelected.filter((id) => id !== bookId)
        : [...prevSelected, bookId]
    );
  };

  // 선택된 책 삭제 기능
  const handleDeleteBooks = async () => {
    try {
      await Promise.all(
        selectedBooks.map(async (bookId) => {
          const requestData = {
            userbookId: `${userId}-${bookId}`,
            status: null,
            favorite: false,
          };
          await api.put(`/bookshelf/update-status`, requestData);
        })
      );
      setReadingBooks((prevBooks) =>
        prevBooks.filter((book) => !selectedBooks.includes(book.bookId))
      );
      setFavorites((prevFavorites) =>
        prevFavorites.filter((book) => !selectedBooks.includes(book.bookId))
      );
      setSelectedBooks([]);
      setIsEditing(false);
    } catch (error) {
      alert("책 삭제 중 오류가 발생했습니다.");
    }
  };

  const renderBookList = (books, tab) => {
    return books.length > 0 ? (
      books.map((book) => (
        <span key={book.bookId} className="mylib-book-item">
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className={`book-cover ${
              isEditing && selectedBooks.includes(book.bookId) ? "selected" : ""
            }`}
            onClick={() =>
              isEditing
                ? handleSelectBook(book.bookId)
                : handleBookClick(book.bookId)
            }
          />
          <span className="book-details">
            <span className="book-title">{book.title}</span>
            <span className="book-author">{book.author}</span>
            {tab === "독서 중" && (
              <>
                <span className="start_on">Started on: {book.startDate}</span>
              </>
            )}
            {tab === "독서 완료" && (
              <p className="completed_on">Completed on: {book.endDate}</p>
            )}
          </span>
        </span>
      ))
    ) : (
      <p>목록이 비어 있습니다.</p>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "책장":
        return (
          <div>
            <div>
              <ul className="subtab_menu">
                {["독서 중", "독서 완료"].map((tab) => (
                  <li
                    key={tab}
                    className={tab === subTab ? "active" : ""}
                    onClick={() => setSubTab(tab)}
                  >
                    {tab}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ul className="mybook-list">
                {renderBookList(
                  subTab === "독서 중" ? readingBooks : completedBooks,
                  subTab
                )}
              </ul>
            </div>
          </div>
        );
      case "My Favorite":
        return (
          <div>
            <h2>My Favorite</h2>
            <ul className="mybook-list">
              {renderBookList(favorites, "My Favorite")}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header2 />
      <div id="mylib">
        <div className="profile_container">
          <span>
            <img src={boogi2} alt="프로필" className="profile_img"></img>
          </span>
          <span className="profile_title">
            {nickname}
            <span>님의 서재</span>
          </span>
        </div>
        <div className="edit-actions">
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "완료" : "편집"}
          </button>
          {isEditing && selectedBooks.length > 0 && (
            <button onClick={handleDeleteBooks}>삭제</button>
          )}
        </div>
        <div>
          <ul className="mylib_menu">
            {["책장", "My Favorite"].map((tab) => (
              <li
                key={tab}
                className={tab === activeTab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>
        <div className="tab_content">{renderContent()}</div>
      </div>
    </>
  );
};

export default MyLib;
