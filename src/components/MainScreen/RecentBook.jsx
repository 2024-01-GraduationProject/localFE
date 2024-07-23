import React from "react";
import useAuth from "routes/Login/UseAuth";
const RecentBook = () => {
  useAuth();

  return (
    <>
      <div id="recent_book">최근 읽은 도서</div>
    </>
  );
};

export default RecentBook;
