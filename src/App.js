import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomeView from "./views/HomeView";
import {
  Join,
  Login,
  MyLib,
  MyPage,
  Taste,
  TasteNext,
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
} from "routes";
import MainView from "views/MainView";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mylib" element={<MyLib />} />
        <Route path="/taste" element={<Taste />} />
        <Route path="/mainview" element={<MainView />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/tastenext" element={<TasteNext />} />
        <Route path="/로맨스" element={<Romance />} />
        <Route path="/스릴러" element={<Thriller />} />
        <Route path="/공포/호러" element={<Horror />} />
        <Route path="/sf" element={<SF />} />
        <Route path="/판타지" element={<Fantasy />} />
        <Route path="/고전" element={<Original />} />
        <Route path="/역사" element={<History />} />
        <Route path="/경제" element={<Economy />} />
        <Route path="/철학" element={<Philosophy />} />
        <Route path="/드라마/영화-원작" element={<Original />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
