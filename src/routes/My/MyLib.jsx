import React, { useState, useEffect } from "react";
import Header2 from "components/Header/Header2";
import boogi2 from "assets/img/boogi2.jpg";
import api from "../../api"; // Axios 인스턴스 import

const MyLib = () => {
  const [activeTab, setActiveTab] = useState("관심 분야");
  const [nickname, setNickname] = useState("");
  const [selectedMoods, setSelectedMoods] = useState([]);

  useEffect(() => {
    // 사용자 데이터 가져오기
    const fetchUserData = async () => {
      try {
        // 닉네임 가져오기
        const nicknameResponse = await api.get("/user-nickname");
        setNickname(nicknameResponse.data.nickname);

        // 관심 분야 데이터 가져오기
        const moodsResponse = await api.get("/user-interests");
        setSelectedMoods(moodsResponse.data);
      } catch (error) {
        alert("사용자 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchUserData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "관심 분야":
        return (
          <div>
            {selectedMoods.length > 0 ? (
              <ul>
                {selectedMoods.map((mood, index) => (
                  <li key={index}>#{mood}</li>
                ))}
              </ul>
            ) : (
              <div>관심 분야가 없습니다.</div>
            )}
          </div>
        );
      case "책장":
        return <div>책장 내용</div>;
      case "My Favorite":
        return <div>My Favorite 내용</div>;
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
            <span>의 서재</span>
          </span>
        </div>
        <div>
          <ul className="mylib_menu">
            {["관심 분야", "책장", "My Favorite"].map((tab) => (
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
