import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Header2,
  SearchBar,
  MainNav,
  BestNew,
  RecentBook,
  FamousBook,
  Recommend,
} from "components";
import { useAuth } from "AuthContext";

const MainView = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 로그인 상태 확인
    const token = localStorage.getItem("authToken");

    if (token) {
      setIsAuthenticated(true); // 로그인 상태 유지
    } else {
      navigate("/login"); // 로그인 상태가 아니라면 로그인 페이지로 이동
    }
  }, [navigate]);

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
        <BestNew />
      </div>

      <div>
        <hr className="mainview_line" />
        <RecentBook />
      </div>

      <div>
        <hr className="mainview_line" />
        <FamousBook />
      </div>

      <div>
        <hr className="mainview_line" />
        <Recommend />
      </div>
    </>
  );
};

export default MainView;
