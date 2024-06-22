import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomeView from "./views/HomeView";
import Join from "./routes/Join";
import Login from "./routes/Login";
import Taste from "./routes/Taste";
import Main from "./components/Main";
import MyPage from "./routes/MyPage";
import TasteNext from "./routes/TasteNext";

// import { BrowserView, MobileView } from "react-device-detect";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/taste" element={<Taste />} />
        <Route path="/main" element={<Main />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/tastenext" element={<TasteNext />} />
      </Routes>
    </BrowserRouter>
    /*
    <div className="App">
      <BrowserView>데스크톱 브라우저</BrowserView>
      <MobileView>모바일 브라우저</MobileView>
    </div>
    */
  );
};

export default App;
