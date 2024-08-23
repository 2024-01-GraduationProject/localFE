import React, { useState, useEffect } from "react";
import { useAuth } from "AuthContext";
import api from "../../api";

const Recommend = () => {
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    // 사용자 데이터 가져오기
    const fetchUserData = async () => {
      try {
        // 닉네임 가져오기
        const nicknameResponse = await api.get("/user-nickname");
        console.log(nicknameResponse);
        setNickname(nicknameResponse.data);
      } catch (error) {
        alert("사용자 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      <div className="main-booklist-component">
        <strong>{nickname}</strong>님, 이런 책 어떠세요?
      </div>
    </>
  );
};

export default Recommend;
