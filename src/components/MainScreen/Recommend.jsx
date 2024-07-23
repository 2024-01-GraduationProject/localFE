import React, { useState, useEffect } from "react";
import useAuth from "routes/Login/UseAuth";

const Recommend = () => {
  useAuth();

  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const storedNickname = sessionStorage.getItem("nickname");
    if (storedNickname) {
      setNickname(storedNickname);
    }
  });
  return (
    <>
      <div id="recommend">{nickname}님, 이런 책 어떠세요?</div>
    </>
  );
};

export default Recommend;
