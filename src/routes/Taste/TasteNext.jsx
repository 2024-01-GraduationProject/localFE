import React from "react";
import { useNavigate } from "react-router-dom";
import { Header2 } from "components";
import boogi2 from "assets/img/boogi2.jpg";
import useAuth from "routes/Login/UseAuth";

const TasteNext = () => {
  useAuth();

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/mainview");
  };

  return (
    <>
      <Header2 />
      <div id="tastenext">
        <img src={boogi2} alt="부기"></img>
        <div className="taste_text">
          <div>감사합니다!</div>
          <div>부기가 취향에 맞는 도서를 소개해드릴게요!</div>
        </div>

        <button className="move_home" onClick={handleNavigate}>
          홈으로 이동하기
        </button>
      </div>
    </>
  );
};

export default TasteNext;
