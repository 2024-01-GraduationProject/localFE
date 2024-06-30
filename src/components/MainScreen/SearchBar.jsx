import React, { useState } from "react";
import search from "assets/img/ico/search.ico";

const SearchBar = () => {
  const [searchBtn, setSearchBtn] = useState("");
  const onSearchChange = (e) => {
    setSearchBtn(e.target.value);
  };

  /* 검색 필터 - includes가 대소문자를 구분해서 소문자로 통일시켜줌
               - replace로 공백도 없애서 검색에 이상 없도록 함
  const filterTitle = books.filter((p) => {
    return p.title.replace(" ", "").toLocaleLowerCase().includes(search.toLocaleLowerCase().replace(" ", ""))
    })
*/
  return (
    <div id="searchbar">
      <div className="search">
        <input
          className="searchInput"
          type="text"
          value={searchBtn}
          onChange={onSearchChange}
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
