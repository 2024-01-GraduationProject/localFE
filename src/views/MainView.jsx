import React, { useState } from "react";
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
