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
import useAuth from "routes/Login/UseAuth";

const MainView = () => {
  useAuth();

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
