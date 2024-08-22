import React, { useEffect } from "react";
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
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // 인증되지 않은 경우 로그인 페이지로 이동
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <div>로딩 중...</div>; // 인증 상태 확인 중에는 로딩 메시지 표시
  }

  return (
    <>
      <Header2 />
      <SearchBar />
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
