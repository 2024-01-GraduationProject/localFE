import React from "react";
import {
  Header2,
  SearchBar,
  MainNav,
  BestNew,
  RecentBook,
  FamousBook,
  Recommend,
} from "components";

const MainView = () => {
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
        <RecentBook />
      </div>

      <div>
        <FamousBook />
      </div>

      <div>
        <Recommend />
      </div>
    </>
  );
};

export default MainView;
