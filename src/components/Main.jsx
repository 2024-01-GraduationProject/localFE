import React, { useState } from "react";
import Header2 from "./Header2";
import SearchBar from "./SearchBar";
import { MdOutlineMenu } from "react-icons/md";
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
        {/*        <span className="mylib">
          <IoLibrary size="1.7em" />
        </span> */}
      </div>
    </>
  );
};

export default Main;
