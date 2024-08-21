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
          <Route path="/books/details/:book_id" element={<BookDetail />} />
          <Route
            path="/books/category/:categoryName"
            element={<BookCategory />}
          />

          <Route path="/books/:book_id/content" element={<BookReader />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
