import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header2 } from "components";
import boogi3 from "../../assets/img/boogi3.jpg";
import api from "../../api";
import { useAuth } from "AuthContext";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { IoMdBook } from "react-icons/io";
import { LuSettings } from "react-icons/lu";

const MyPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authToken } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await api.get("/user-data");
        setUser(response.data);
      } catch (error) {
        console.error("데이터 불러오기 실패: ", error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, authToken, navigate]);

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
          <h2>{user.nickname} 님</h2>
          <div className="info">
            <div>
              <MdOutlineEmail className="mypage-icon" size="28" />
              <span>{user.email}</span>
            </div>
            <div>
              <FaRegUser className="mypage-icon" size="28" />
              <span>
                {user.age}, {user.gender}
              </span>
            </div>
            <div>
              <IoMdBook className="mypage-icon" size="28" />
              {user.mood.map((mood, index) => (
                <span key={index} className="mood-tag">
                  #{mood}
                </span>
              ))}
            </div>
            <div>
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
