import React from "react";
import { Link } from "react-router-dom";
import { tasteAge, tasteGender, tasteText } from "../constants";
import Header2 from "../components/Header2";

const Taste = () => {
  return (
    <>
      <Header2 />
      <div id="taste">
        <div className="taste_text">여러분의 독서 취향을 알려주세요!</div>
        <div className="select_taste">
          <div>연령/성별</div>
          <select className="selectAge">
            <option value="">연령 선택</option>
            {tasteAge.map((taste, key) => (
              <option key={taste.age} value={taste.age}>
                {taste.age}
              </option>
            ))}
          </select>

          <select className="selectGender">
            <option value="">성별 선택</option>
            {tasteGender.map((taste, key) => (
              <option key={taste.gender} value={taste.gender}>
                {taste.gender}
              </option>
            ))}
          </select>
        </div>

        <div className="mood">
          <div>유형(분위기)</div>
          {tasteText.map((taste, key) => (
            <button key={key}>#{taste.title}</button>
          ))}
        </div>

        <div>
          <button className="nextbtn">{">"} 다음으로</button>
        </div>
      </div>
    </>
  );
};

export default Taste;
