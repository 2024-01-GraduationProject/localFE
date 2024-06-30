import React from "react";
import { Link } from "react-router-dom";
import { Header2 } from "components";
import boogi2 from "assets/img/boogi2.jpg";

const TasteNext = () => {
  return (
    <>
      <Header2 />
      <div id="tastenext">
        <img src={boogi2} alt="부기"></img>
        <div className="taste_text">
          <div>감사합니다!</div>
          <div>부기가 취향에 맞는 도서를 소개해드릴게요!</div>
        </div>
        <Link to="/mainview">
          <button className="move_home">홈으로 이동하기</button>
        </Link>
      </div>
    </>
  );
};

export default TasteNext;
