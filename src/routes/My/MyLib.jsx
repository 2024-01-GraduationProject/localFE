import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header2 from "components/Header/Header2";
import boogi2 from "assets/img/boogi2.jpg";
import api from "../../api"; // Axios 인스턴스 import
import { useAuth } from "AuthContext";

const MyLib = () => {
  const [activeTab, setActiveTab] = useState("책장");
  const [readingBooks, setReadingBooks] = useState([]);
  const [completedBooks, setCompletedBooks] = useState([]);
  const [nickname, setNickname] = useState("");
  const [favorites, setFavorites] = useState([]);

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
        // 닉네임 가져오기
        const nicknameResponse = await api.get("/user-nickname");
        console.log(nicknameResponse);
        setNickname(nicknameResponse.data);
      } catch (error) {
        alert("사용자 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (activeTab === "책장") {
      // "독서 중" 책과 "독서 완료" 책 가져오기
      const fetchBooks = async () => {
        try {
          const readingResponse = await api.get("/user-isReading");
          const completedResponse = await api.get("/user-alreadyRead");
          setReadingBooks(readingResponse.data);
          setCompletedBooks(completedResponse.data);
        } catch (error) {
          alert("책 데이터를 가져오는 중 오류가 발생했습니다.");
        }
      };

      fetchBooks();
    } else if (activeTab === "My Favorite") {
      // 즐겨찾기 목록 가져오기
      const fetchFavorites = async () => {
        try {
          const response = await api.get("/user/favorites");
          setFavorites(response.data);
        } catch (error) {
          alert("즐겨찾기 목록을 가져오는 중 오류가 발생했습니다.");
        }
      };

      fetchFavorites();
    }
  }, [activeTab]);

  const renderBookList = (books) => {
    return books.length > 0 ? (
      books.map((book) => (
        <li key={book.id}>
          <img
            src={book.coverImageUrl}
            alt={book.title}
            style={{ width: "50px", height: "auto" }}
          />
          <span>{book.title}</span>
        </li>
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
              <h3>독서 중</h3>
              <ul>{renderBookList(readingBooks)}</ul>
            </div>
            <div>
              <h3>독서 완료</h3>
              <ul>{renderBookList(completedBooks)}</ul>
            </div>
          </div>
        );
      case "My Favorite":
        return (
          <div>
            <h2>My Favorite</h2>
            <ul>{renderBookList(favorites)}</ul>
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
