import React, { useState, useEffect } from "react";
import { Header2 } from "components";
import { FaCamera } from "react-icons/fa";
import boogi3 from "../../assets/img/boogi3.jpg";
import api from "../../api";

const MyPage = () => {
  // 현재 활성화된 탭 관리
  const [activeTab, setActiveTab] = useState("profile");

  // 사용자 정보 저장
  const [userData, setUserData] = useState({
    nickname: "",
    email: "",
    loginType: "",
    profilePicture: boogi3, // 기본 프로필
    age: "",
    gender: "",
    currentPassword: "",
    newPassword: "",
  });
  const [selectedTastes, setSelectedTastes] = useState([]); // 관심 분야 저장
  const [editMode, setEditMode] = useState(false); // 편집 모드 관리
  const [inputPassword, setInputPassword] = useState(""); // 입력받은 현재 비밀번호 저장
  const [error, setError] = useState(""); // 오류 메시지 저장

  // 컴포넌트 처음 렌더링 될 때 사용자 데이터 가져옴
  useEffect(() => {
    // 사용자 데이터 가져오기
    const fetchUserData = async () => {
      try {
        // 사용자 데이터 요청
        const response = await api.get("/user-data");
        setUserData(response.data);
        // 관심 분야 데이터 요청
        const tastesResponse = await api.get("/user-taste");
        setSelectedTastes(tastesResponse.data);
      } catch (error) {
        alert("사용자 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };
    fetchUserData();
  }, []); // 빈 배열 넣어서 처음 마운트될 때만 실행

  // 입력 필드값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 현재 비밀번호 입력 필드값 변경 핸들러
  const handlePasswordChange = (e) => {
    setInputPassword(e.target.value);
  };

  // 프로필 사진 변경 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevData) => ({
          ...prevData,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 사용자 데이터 저장 핸들러
  const handleSave = async () => {
    try {
      // 사용자 데이터 업데이트 요청
      await api.put("/user-data", {
        ...userData,
        currentPassword: inputPassword,
      });
      alert("저장되었습니다.");
      setEditMode(false); // 저장 후 편집 모드 종료
    } catch (error) {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  // 닉네임 중복 확인 핸들러
  const checkNicknameAvailability = async () => {
    try {
      const response = await api.get(`/check-nickname/${userData.nickname}`);
      if (response.data.available) {
        alert("닉네임 사용 가능");
      } else {
        alert("닉네임이 이미 존재합니다.");
      }
    } catch (error) {
      alert("닉네임 중복 검사 중 오류가 발생했습니다.");
    }
  };

  // 개인정보 렌더링
  const renderPersonalInfo = () => (
    <div className="user_info">
      <label>
        닉네임:
        <div className="input_with_button">
          <input
            type="text"
            name="nickname"
            value={userData.nickname}
            onChange={handleInputChange}
            readOnly={!editMode}
            className={`editable ${editMode ? "" : "readonly"}`}
          />
          {editMode && (
            <button
              type="button"
              onClick={checkNicknameAvailability}
              className="check_nickname_button"
            >
              중복 확인
            </button>
          )}
        </div>
      </label>
      <label>
        이메일:
        <input
          type="email"
          name="email"
          value={userData.email}
          readOnly
          className="readonly"
        />
      </label>
      <label>
        로그인 타입:
        <input
          type="text"
          name="loginType"
          value={userData.loginType}
          readOnly
          className="readonly"
        />
      </label>
      {editMode && (
        <>
          <label>
            현재 비밀번호:
            <input
              type="password"
              name="currentPassword"
              value={inputPassword}
              onChange={handlePasswordChange}
              className="editable"
            />
          </label>
          <label>
            새 비밀번호:
            <input
              type="password"
              name="newPassword"
              value={userData.newPassword}
              onChange={handleInputChange}
              className="editable"
            />
          </label>
          <button onClick={handleSave}>저장</button>
          {error && <div className="error_message">{error}</div>}
        </>
      )}
      {!editMode && <button onClick={() => setEditMode(true)}>수정</button>}
    </div>
  );

  // 개인설정(관심분야, 연령, 성별) 정보 렌더링
  const renderProfileAndTastes = () => (
    <div>
      <div className="user_info">
        <label>
          연령:
          <input
            type="number"
            name="age"
            value={userData.age}
            onChange={handleInputChange}
            readOnly={!editMode}
            className={`editable ${editMode ? "" : "readonly"}`}
          />
        </label>
        <label>
          성별:
          <input
            type="text"
            name="gender"
            value={userData.gender}
            onChange={handleInputChange}
            readOnly={!editMode}
            className={`editable ${editMode ? "" : "readonly"}`}
          />
        </label>
      </div>
      <h3>관심 분야</h3>
      <div className="tastes_list">
        <ul>
          {selectedTastes.map((taste) => (
            <li key={taste.id}>#{taste.category}</li>
          ))}
        </ul>
      </div>
      {editMode && (
        <>
          <label>
            현재 비밀번호:
            <input
              type="password"
              name="currentPassword"
              value={inputPassword}
              onChange={handlePasswordChange}
              className="editable"
            />
          </label>
          <button onClick={handleSave}>저장</button>
          {error && <div className="error_message">{error}</div>}
        </>
      )}
      {!editMode && <button onClick={() => setEditMode(true)}>수정</button>}
    </div>
  );

  // 활성화된 탭에 따라 콘텐츠 렌더링
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderPersonalInfo(); // 개인정보
      case "profileAndMoods":
        return renderProfileAndTastes(); // 개인설정
      default:
        return null;
    }
  };

  return (
    <>
      <Header2 />
      <div id="mypage">
        <div className="profile_container">
          <span className="profile_picture_container">
            <img
              src={userData.profilePicture}
              alt="프로필"
              className="profile_img"
            />
            {editMode && (
              <>
                <input
                  type="file"
                  id="profileImageInput"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <FaCamera
                  className="camera_icon"
                  onClick={() =>
                    document.getElementById("profileImageInput").click()
                  }
                />
              </>
            )}
          </span>
          <span className="profile_title">
            {userData.nickname}
            <span>님의 정보</span>
          </span>
        </div>
        <ul className="mypage_menu">
          <li
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            가입정보
          </li>
          <li
            className={activeTab === "profileAndTastes" ? "active" : ""}
            onClick={() => setActiveTab("profileAndTastes")}
          >
            개인설정
          </li>
        </ul>
        <div className="tab_content">{renderContent()}</div>
      </div>
    </>
  );
};

export default MyPage;
