import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Header2,
  SearchBar,
  MainNav,
  NewBook,
  BestBook,
  FamousBook,
  RecommendBook,
} from "components";
import { useAuth } from "AuthContext";

const MainView = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // 인증 상태가 false이면 로그인 페이지로 리디렉션
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSearchResults = (results) => {
    // 검색 결과를 SearchList 페이지로 전달
    navigate("/searchlist", { state: { searchResults: results } });
  };

  if (!isAuthenticated) {
    return <div>로딩 중...</div>; // 로딩 중 메시지 표시
  }

  return (
    <>
      <Header2 />
      <SearchBar onSearch={handleSearchResults} />
      <MainNav />

      <div>
        <hr className="mainview_line" />
        <NewBook />
      </div>

      <div>
        <hr className="mainview_line" />
        <BestBook />
      </div>

      <div>
        <hr className="mainview_line" />
        <FamousBook />
      </div>

      <div>
        <hr className="mainview_line" />
        <RecommendBook />
      </div>
    </>
  );
};

export default MainView;
