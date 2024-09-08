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
  KakaoLogin,
} from "routes";
import {
  BookDetail,
  BookReader,
  BookCategory,
  SearchList,
  BoogiChatbot,
} from "components";
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
          <Route path="/googleLogin" element={<GoogleLogin />} />
          <Route path="/kakaoLogin" element={<KakaoLogin />} />
          <Route path="/mylib" element={<MyLib />} />
          <Route path="/taste" element={<Taste />} />
          <Route path="/mainview" element={<MainView />} />
          <Route path="/homeview" element={<HomeView />} />
          <Route path="/editmypage" element={<EditMyPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/editmypage" element={<EditMyPage />} />
          <Route path="/tastenext" element={<TasteNext />} />
          <Route path="/books/details/:bookId" element={<BookDetail />} />
          <Route
            path="/books/category/:categoryName"
            element={<BookCategory />}
          />
          <Route path="/books/:bookId/content" element={<BookReader />} />
          <Route path="/books/:bookId/boogi" element={<BoogiChatbot />} />
          <Route path="/searchlist" element={<SearchList />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
