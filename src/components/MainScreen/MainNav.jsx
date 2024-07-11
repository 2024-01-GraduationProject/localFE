import React, { useEffect, useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { Link } from "react-router-dom";
import { GiBookshelf } from "react-icons/gi";
import api from "../../api"; // Axios 인스턴스 import

const MainNav = () => {
  const [showTasteButtons, setShowTasteButtons] = useState(false);
  const [tasteOptions, setTasteOptions] = useState([]);

  useEffect(() => {
    // 취향 데이터 가져오기
    const fetchTastes = async () => {
      try {
        const response = await api.get("/book-categories");
        setTasteOptions(response.data);
      } catch (error) {
        console.log("취향 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchTastes();
  }, []);

  const handleHambtnClick = () => {
    setShowTasteButtons(!showTasteButtons);
  };

  const getLinkPath = (title) => {
    // title 값을 소문자로 변환하고 공백을 대시(-)로 변환하여 URL 경로를 생성
    return `/${title.toLowerCase().replace(/ /g, "-")}`;
  };

  return (
    <>
      <div className="main_nav">
        <button className="hambtn" onClick={handleHambtnClick}>
          <MdOutlineMenu size="3em" />
        </button>
        <Link to="/mylib">
          <button className="mylib">
            <GiBookshelf size="3em" />
          </button>
        </Link>
      </div>

      {showTasteButtons && (
        <div className="taste_buttons">
          {tasteOptions.map((taste, index) => (
            <Link to={getLinkPath(taste.title)} key={index}>
              <button className="taste_button">{taste.title}</button>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default MainNav;
