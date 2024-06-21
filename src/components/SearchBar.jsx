import React from "react";
import search from "../assets/img/search.ico";
const SearchBar = () => {
  return (
    <div id="searchbar">
      <div className="search">
        <input
          className="searchInput"
          type="text"
          placeholder="검색어를 입력해주세요."
        />
        <button className="searchbtn">
          <img className="searchIcon" src={search} alt="돋보기"></img>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
