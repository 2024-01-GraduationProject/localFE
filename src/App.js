import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomeView from "./views/HomeView";
import { Join, Login, MyLib, MyPage, Taste, TasteNext } from "routes";
import Main from "views/MainView";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mylib" element={<MyLib />} />
        <Route path="/taste" element={<Taste />} />
        <Route path="/main" element={<Main />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/tastenext" element={<TasteNext />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
