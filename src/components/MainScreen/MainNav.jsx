import React, { useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { Link } from "react-router-dom";
import { GiBookshelf } from "react-icons/gi";
import { tasteText } from "../../constants/index";

const MainNav = () => {
  const [showTasteButtons, setShowTasteButtons] = useState(false);

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
          {tasteText.map((taste, index) => (
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
