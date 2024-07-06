import React, { useState, useEffect } from "react";

const Recommend = () => {
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
