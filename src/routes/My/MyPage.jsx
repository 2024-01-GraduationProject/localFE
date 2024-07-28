import React, { useState, useEffect } from "react";
import { Header2 } from "components";
import { FaCamera } from "react-icons/fa";
import boogi3 from "../../assets/img/boogi3.jpg";
import api from "../../api";
import useAuth from "routes/Login/UseAuth";

const MyPage = () => {
  useAuth();

  // 현재 활성화된 탭을 관리하는 상태
  const [activeTab, setActiveTab] = useState("profile");

  // 사용자 정보를 저장하는 상태
  const [userData, setUserData] = useState({
    nickname: "",
    email: "",
    loginType: "book-mind 자체 로그인",
    profilePicture: boogi3,
    age: "",
    gender: "",
    currentPassword: "",
    newPassword: "",
  });

  // 기존 사용자 정보를 저장하는 상태
  const [originalData, setOriginalData] = useState({
    nickname: "",
    newPassword: "",
  });

  // 관심 분야와 전체 카테고리 정보를 저장하는 상태
  const [selectedTastes, setSelectedTastes] = useState("");
  const [allTastes, setAllTastes] = useState([]);

  // 연령과 성별 드롭다운에 사용할 데이터를 저장하는 상태
  const [ages, setAges] = useState([]);
  const [genders, setGenders] = useState([]);

  // 편집 모드를 관리하는 상태
  const [editMode, setEditMode] = useState({
    profile: false,
    profileAndTastes: false,
  });

  // 현재 비밀번호 입력값을 저장하는 상태
  const [inputPassword, setInputPassword] = useState("");

  // 오류 메시지를 저장하는 상태
  const [error, setError] = useState("");

  // 컴포넌트가 처음 렌더링될 때 사용자 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 사용자 데이터 요청
        const userDataResponse = await api.get("/user-data");
        setUserData(userDataResponse.data);
        setOriginalData({
          nickname: userDataResponse.data.nickname,
          newPassword: "", // 초기에는 비밀번호가 빈 문자열임
        });

        // (사용자) 관심 분야 데이터 요청
        const tastesResponse = await api.get("/user-taste");
        console.log("User tastes response:", tastesResponse.data);
        setSelectedTastes(tastesResponse.data);
        console.log(selectedTastes);

        // 전체 관심분야(카테고리) 데이터 요청
        const allTastesResponse = await api.get("/book-categories");
        console.log("bookCategories response:", allTastesResponse.data);
        setAllTastes(allTastesResponse.data || []);
        console.log(allTastesResponse);

        // 전체 연령 데이터 요청
        const ageResponse = await api.get("/ages");
        setAges(ageResponse.data || []);

        // 전체 성별 데이터 요청
        const genderResponse = await api.get("/genders");
        setGenders(genderResponse.data || []);
      } catch (error) {
        alert("사용자 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchUserData();
  }, []); // 빈 배열을 넣어 처음 마운트될 때만 실행

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

  // 수정 버튼 클릭 핸들러
  const handleEditClick = (section) => {
    setEditMode((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
    setActiveTab(section); // 클릭한 탭으로 활성화
  };

  // 저장 버튼 클릭 핸들러
  const handleSaveChanges = async (section) => {
    try {
      const changes = {};
      if (userData.nickname !== originalData.nickname) {
        changes.nickname = userData.nickname;
      }
      if (userData.newPassword !== originalData.newPassword) {
        changes.newPassword = userData.newPassword;
      }

      if (section === "profile") {
        // 프로필 정보 저장 요청
        if (Object.keys(changes).length > 0) {
          await api.post("/update-userData", {
            ...changes,
            currentPassword: inputPassword,
          });
        }
      } else if (section === "profileAndTastes") {
        // 관심 분야 저장 요청
        await api.post("/update-tastes", { tastes: selectedTastes });
      }
      handleEditClick(section); // 저장 후 편집 모드 종료
    } catch (error) {
      setError("변경 사항 저장 중 오류가 발생했습니다.");
    }
  };

  // 관심 분야 선택 핸들러
  const handleAddTaste = (taste) => {
    if (!selectedTastes.includes(taste)) {
      setSelectedTastes((prev) => [...prev, taste]);
    }
  };

  // 관심 분야 제거 핸들러
  const handleRemoveTaste = (taste) => {
    setSelectedTastes((prev) => prev.filter((item) => item !== taste));
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
            readOnly={!editMode.profile}
            className={`editable ${editMode.profile ? "" : "readonly"}`}
          />
          {editMode.profile && (
            <button
              type="button"
              onClick={() => {}} // 아직 중복 확인 핸들러 만들지 않음.
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
      {editMode.profile && (
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
          <button onClick={() => handleSaveChanges("profile")}>저장</button>
          {error && <div className="error_message">{error}</div>}
        </>
      )}
      {!editMode.profile && (
        <button onClick={() => handleEditClick("profile")}>수정</button>
      )}
    </div>
  );

  // 개인설정(관심분야, 연령, 성별) 정보 렌더링
  const renderProfileAndTastes = () => {
    return (
      <div className="user_info">
        <label>
          관심 분야:
          <div
            className={`tastes_list ${
              editMode.profileAndTastes ? "" : "readonly" // 스타일 적용을 위함.
            }`}
          >
            <ul>
              {editMode.profileAndTastes ? (
                (allTastes || []).map((taste) => (
                  <li
                    key={taste.category_id}
                    className={`taste-item ${
                      selectedTastes.includes(taste.category) ? "selected" : ""
                    }`}
                    onClick={() => {
                      if (selectedTastes.includes(taste.category)) {
                        handleRemoveTaste(taste.category);
                      } else {
                        handleAddTaste(taste.category);
                      }
                    }}
                  >
                    #{taste.category}
                  </li>
                ))
              ) : selectedTastes.length === 0 ? (
                <li>선택된 관심 분야가 없습니다</li>
              ) : (
                selectedTastes.map((taste) => (
                  <li key={taste} className="taste-item selected">
                    #{taste}
                  </li>
                ))
              )}
            </ul>
          </div>
        </label>
        <label>
          연령:
          <select
            name="age"
            value={userData.age}
            onChange={handleInputChange}
            disabled={!editMode.profileAndTastes}
            className={`editable ${
              editMode.profileAndTastes ? "" : "readonly"
            }`}
          >
            {(ages || []).map((ageObj) => (
              <option key={ageObj.id} value={ageObj.age}>
                {ageObj.age}
              </option>
            ))}
          </select>
        </label>
        <label>
          성별:
          <select
            name="gender"
            value={userData.gender}
            onChange={handleInputChange}
            disabled={!editMode.profileAndTastes}
            className={`editable ${
              editMode.profileAndTastes ? "" : "readonly"
            }`}
          >
            {(genders || []).map((genderObj) => (
              <option key={genderObj.id} value={genderObj.gender}>
                {genderObj.gender}
              </option>
            ))}
          </select>
        </label>

        {/* editMode일 때만 현재 비밀번호 입력 필드와 저장 버튼 표시 */}
        {editMode.profileAndTastes && (
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
            <button onClick={() => handleSaveChanges("profileAndTastes")}>
              저장
            </button>
            {error && <div className="error_message">{error}</div>}
          </>
        )}

        {/* readonly에서는 수정 버튼만 표시 */}
        {!editMode.profileAndTastes && (
          <button onClick={() => handleEditClick("profileAndTastes")}>
            수정
          </button>
        )}
      </div>
    );
  };

  return (
    <div id="mypage">
      <Header2>마이 페이지</Header2>
      <div className="profile_container">
        <div className="profile_img">
          <img src={userData.profilePicture} alt="Profile" />
          {editMode.profile && (
            <div className="profile_picture_container">
              <label className="camera_icon">
                <FaCamera />
                <input type="file" onChange={handleImageChange} />
              </label>
            </div>
          )}
        </div>
        <div className="profile_title">
          {userData.nickname}
          <span>님</span>
        </div>
      </div>
      <ul className="mypage_menu">
        <li
          onClick={() => setActiveTab("profile")}
          className={activeTab === "profile" ? "active" : ""}
        >
          개인정보
        </li>
        <li
          onClick={() => setActiveTab("profileAndTastes")}
          className={activeTab === "profileAndTastes" ? "active" : ""}
        >
          관심분야
        </li>
      </ul>
      <div className="mypage_content">
        {activeTab === "profile" && renderPersonalInfo()}
        {activeTab === "profileAndTastes" && renderProfileAndTastes()}
      </div>
    </div>
  );
};

export default MyPage;
