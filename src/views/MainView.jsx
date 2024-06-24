import React, { useState } from "react";
import {
  Header2,
  SearchBar,
  BestNew,
  RecentBook,
  FamousBook,
  Recommend,
} from "components";
import { MdOutlineMenu } from "react-icons/md";
import { Link } from "react-router-dom";
import { IoLibrary } from "react-icons/io5";

const Main = () => {
  return (
    <>
      <Header2 />
      <SearchBar />
      <div className="main_nav">
        <button className="hambtn">
          <MdOutlineMenu size="2em" />
        </button>
        <Link to="/mylib">
          <button className="mylib">내 서재</button>
        </Link>
      </div>

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

export default Main;
