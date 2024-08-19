import React from "react";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";

import HomeView from "./views/HomeView";
import {
  Join,
  Login,
  MyLib,
  MyPage,
  EditMyPage,
  Taste,
  TasteNext,
  GoogleLogin,
  NaverLogin,
  KakaoLogin,
} from "routes";
import { BookDetail, BookReader, BookCategory } from "components";
import MainView from "views/MainView";
import { AuthProvider } from "./AuthContext";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/google" element={<GoogleLogin />} />
          <Route path="/login/kakao" element={<KakaoLogin />} />
          <Route path="/login/naver" element={<NaverLogin />} />
          <Route path="/mylib" element={<MyLib />} />
          <Route path="/taste" element={<Taste />} />
          <Route path="/mainview" element={<MainView />} />
          <Route path="/homeview" element={<HomeView />} />
          <Route path="/editmypage" element={<EditMyPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/editmypage" element={<EditMyPage />} />
          <Route path="/tastenext" element={<TasteNext />} />
          <Route
            path="/books/romance"
            element={<BookCategory categoryName="로맨스" />}
          />
          <Route
            path="/books/thriller"
            element={<BookCategory categoryName="스릴러" />}
          />
          <Route
            path="/books/horror"
            element={<BookCategory categoryName="공포/호러" />}
          />
          <Route
            path="/books/sf"
            element={<BookCategory categoryName="SF" />}
          />
          <Route
            path="/books/fantasy"
            element={<BookCategory categoryName="판타지" />}
          />
          <Route
            path="/books/classic"
            element={<BookCategory categoryName="고전" />}
          />
          <Route
            path="/books/history"
            element={<BookCategory categoryName="역사" />}
          />
          <Route
            path="/books/economy"
            element={<BookCategory categoryName="경제" />}
          />
          <Route
            path="/books/philosophy"
            element={<BookCategory categoryName="철학" />}
          />
          <Route
            path="/books/original"
            element={<BookCategory categoryName="드라마/영화 원작" />}
          />
          <Route path="/books/:book_id" element={<BookDetail />} />
          <Route path="/books/:book_id/content" element={<BookReader />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
