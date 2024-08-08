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
import {
  Romance,
  Thriller,
  Horror,
  SF,
  Fantasy,
  Classic,
  History,
  Economy,
  Philosophy,
  Original,
  BookDetail,
  BookReader,
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
          <Route path="/Romance" element={<Romance />} />
          <Route path="/Thriller" element={<Thriller />} />
          <Route path="/Horror" element={<Horror />} />
          <Route path="/SF" element={<SF />} />
          <Route path="/Fantasy" element={<Fantasy />} />
          <Route path="/Classic" element={<Classic />} />
          <Route path="/History" element={<History />} />
          <Route path="/Economy" element={<Economy />} />
          <Route path="/Philosophy" element={<Philosophy />} />
          <Route path="/Original" element={<Original />} />
          <Route path="/books/:book_id" element={<BookDetail />} />
          <Route path="/reader/:book_id" element={<BookReader />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
