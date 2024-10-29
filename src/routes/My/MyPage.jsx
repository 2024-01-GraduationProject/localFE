import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header2 } from "components";
import boogi3 from "../../assets/img/boogi3.jpg";
import api from "../../api";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { IoMdBook } from "react-icons/io";
import { LuSettings } from "react-icons/lu";

const MyPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/user-data`);
        setUser(response.data);
      } catch (error) {
        console.error("데이터 불러오기 실패: ", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <Header2 />
      <div id="my-page">
        <div className="user-info">
          <div className="profile-pic-div">
            <img
              src={user.profilePic || boogi3}
              alt="프로필"
              className="profile-pic"
            />
          </div>
          <h2 className="userName">{user.nickname} 님</h2>
          <div className="info">
            <div style={{ "--i": 1 }}>
              <MdOutlineEmail className="mypage-icon" size="28" />
              <span>{user.email}</span>
            </div>
            <div style={{ "--i": 2 }}>
              <FaRegUser className="mypage-icon" size="28" />
              <span>
                {user.age}, {user.gender}
              </span>
            </div>
            <div style={{ "--i": 3 }}>
              <IoMdBook className="mypage-icon" size="28" />
              {user.bookTaste.map((bookTaste, index) => (
                <span key={index} className="bookTaste-tag">
                  #{bookTaste}
                </span>
              ))}
            </div>
            <div style={{ "--i": 4 }}>
              <LuSettings className="mypage-icon" size="28" />
              <span>{user.loginMethod}</span>
            </div>
          </div>
          <button className="editBtn" onClick={() => navigate("/editmypage")}>
            회원정보 수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
