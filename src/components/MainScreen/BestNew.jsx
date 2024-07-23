import React from "react";
import useAuth from "routes/Login/UseAuth";

const BestNew = () => {
  useAuth();

  return (
    <>
      <div id="bestNew">베스트 / 신간</div>
    </>
  );
};

export default BestNew;
