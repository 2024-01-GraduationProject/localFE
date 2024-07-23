import React from "react";
import useAuth from "routes/Login/UseAuth";

const FamousBook = () => {
  useAuth();

  return (
    <>
      <div id="famous_book">요즘 ㅇㅇ대 ㅇㅇ이 많이 보는 책</div>
    </>
  );
};

export default FamousBook;
