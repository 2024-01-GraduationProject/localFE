import React, { useState, useEffect } from "react";
import Header2 from "components/Header/Header2";
import boogi2 from "assets/img/boogi2.jpg";

const MyLib = () => {
  const [activeTab, setActiveTab] = useState("관심 분야");
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const storedNickname = sessionStorage.getItem("nickname");
    if (storedNickname) {
      setNickname(storedNickname);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "관심 분야":
        return <div>관심 분야 내용</div>;
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
