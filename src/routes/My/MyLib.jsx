import React, { useState, useEffect } from "react";
import Header2 from "components/Header/Header2";
import boogi2 from "assets/img/boogi2.jpg";
import api from "../../api"; // Axios 인스턴스 import
import { useAuth } from "AuthContext";

const MyLib = () => {
  const [activeTab, setActiveTab] = useState("책장");
  const [nickname, setNickname] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // 사용자 데이터 가져오기
    const fetchUserData = async () => {
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
    if (activeTab === "My Favorite") {
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

  const renderContent = () => {
    switch (activeTab) {
      case "책장":
        return <div>책장 내용</div>;
      case "My Favorite":
        return (
          <div>
            <h2>My Favorite</h2>
            <ul>
              {favorites.length > 0 ? (
                favorites.map((book) => (
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
                <p>My Favorite 목록이 비어 있습니다.</p>
              )}
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
