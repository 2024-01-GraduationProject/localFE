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
    currentAge: "",
    newAge: "",
    currentGender: "",
    newGender: "",
    currentPassword: "",
    newPassword: "",
  });

  // 기존 사용자 정보를 저장하는 상태
  const [originalData, setOriginalData] = useState({
    nickname: "",
    profilePicture: "",
    age: "",
    gender: "",
    selectedTastes: [],
  });

  // 관심 분야와 전체 카테고리 정보를 저장하는 상태
  const [selectedTastes, setSelectedTastes] = useState("");
  const [allTastes, setAllTastes] = useState([]);

  const [userPicture, setUserPictures] = useState("");

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

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  // 닉네임 중복 확인 결과와 상태 저장
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  // 컴포넌트가 처음 렌더링될 때 사용자 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 사용자 데이터 요청
        const userDataResponse = await api.get("/user-data");
        setUserData(userDataResponse.data);
        setOriginalData((prevData) => ({
          ...prevData,
          nickname: userDataResponse.data.nickname,
          age: userDataResponse.data.age,
          gender: userDataResponse.data.gender,
        }));
        //console.log("original data after user-data: ", originalData);

        // (사용자) 관심 분야 데이터 요청
        const tastesResponse = await api.get("/user-taste");
        setSelectedTastes(tastesResponse.data);
        setOriginalData((prevData) => ({
          ...prevData,
          selectedTastes: tastesResponse.data,
        }));
        //console.log("original data after user-taste ", originalData);

        /*
        // 사용자 프로필 사진 데이터 요청
        const userPictureResponse = await api.get("/user-profilePicture");
        setUserPictures(userPictureResponse.data);
        setOriginalData((prevData) => ({
          ...prevData,
          profilePicture: userPictureResponse.data,
        }));
        //console.log("original data after user-profilePicture ", originalData);
*/
        // 전체 관심분야(카테고리) 데이터 요청
        const allTastesResponse = await api.get("/book-categories");
        setAllTastes(allTastesResponse.data || []);
        console.log(allTastes);

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

  useEffect(() => {
    // originalData가 업데이트된 후 콘솔 로그를 찍습니다
    console.log("original data after update: ", originalData);
  }, [originalData]);

  // 입력 필드값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "nickname") {
      setIsNicknameAvailable(null); // 닉네임 변경 시 중복 확인 상태 초기화
    }
  };

  // 현재 비밀번호 입력 필드값 변경 핸들러
  const handlePasswordChange = (e) => {
    const value = e.target.value.replace(/\s/g, ""); // 공백 제거
    setInputPassword(value);
  };

  // 패스워드 input에서 공백 입력하면 기호 보이지 않도록 설정
  const handlePasswordInput = (e) => {
    if (e.inputType === "insertText" && e.data === " ") {
      e.preventDefault();
    }
  };

  // 패스워드 유효성 검사 핸들러
  const passwordCheckHandler = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@$&-_])(?=.*[0-9]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      setNewPasswordError(
        "* 비밀번호는 8~16자리 영문 대소문자 + 숫자 + ! @ $ & - _ 조합으로 입력해주세요."
      );
      return false;
    } else {
      setNewPasswordError("");
      return true;
    }
  };

  /* 프로필 사진 변경 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPictures((prevData) => ({
          ...prevData,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  }; */

  // 수정 버튼 클릭 핸들러
  const handleEditClick = (section) => {
    setEditMode((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
    setActiveTab(section); // 클릭한 탭으로 활성화
    // 개인정보 섹션 수정 모드를 비활성화
    if (section === "profileAndTastes") {
      setEditMode((prev) => ({
        ...prev,
        profile: false,
      }));
    } else {
      setEditMode((prev) => ({
        ...prev,
        profileAndTastes: false,
      }));
    }
  };

  /*
  const uploadProfilePicture = async (profilePicture) => {
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
    try {
      const response = await api.post("/update-profilePicture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.url;
    } catch (error) {
      console.error("프로필 사진 업로드 중 오류가 발생했습니다:", error);
      return null;
    }
  }; */

  // 저장 버튼 클릭 핸들러
  const handleSaveChanges = async (section) => {
    if (!inputPassword) {
      alert("현재 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      const changes = {};
      if (section === "profile") {
        if (
          userData.nickname !== originalData.nickname ||
          userData.newPassword
        ) {
          if (userData.nickname !== originalData.nickname) {
            changes.nickname = userData.nickname;
          }
          if (userData.newPassword) {
            if (!passwordCheckHandler(userData.newPassword)) {
              return;
            }
            changes.newPassword = userData.newPassword;
          }
          await api.post("/update-userData", {
            ...changes,
            currentPassword: inputPassword,
          });
          // 비밀번호가 성공적으로 변경된 경우
          if (changes.newPassword) {
            setUserData((prevData) => ({
              ...prevData,
              currentPassword: changes.newPassword,
              newPassword: "",
            }));
            setInputPassword(""); // 입력 필드 초기화
          }
        } else {
          alert("수정된 부분이 없습니다.");
          return;
        }
      } else if (section === "profileAndTastes") {
        if (
          selectedTastes.length !== originalData.selectedTastes.length ||
          userData.age !== originalData.age ||
          userData.gender !== originalData.gender
          //userPicture.profilePicture !== originalData.profilePicture
        ) {
          if (userData.age !== originalData.age) {
            changes.newAge = userData.age;
          }
          if (userData.gender !== originalData.gender) {
            changes.newGender = userData.gender;
          }
          if (selectedTastes.length !== originalData.selectedTastes.length) {
            changes.newSelectedTastes = selectedTastes;
          }
          /*if (userPicture.profilePicture !== originalData.profilePicture) {
            const profilePictureUrl = await uploadProfilePicture(
              userPicture.profilePicture
            );
            if (profilePictureUrl) {
              changes.newProfilePicture = profilePictureUrl;
            } else {
              alert("프로필 사진 업로드에 실패했습니다.");
              return;
            }
          }*/
          await api.post("/update-tastes", {
            ...changes,
            currentPassword: inputPassword,
          });
        } else {
          alert("수정된 부분이 없습니다.");
          return;
        }
      }
      handleEditClick(section); // 저장 후 편집 모드 종료
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setCurrentPasswordError("* 비밀번호가 일치하지 않습니다.");
      } else {
        alert("* 변경 사항 저장 중 오류가 발생했습니다.");
      }
    }
  };

  // 닉네임 중복 확인 함수
  const checkNicknameDuplication = async () => {
    setIsCheckingNickname(true);
    setIsNicknameAvailable(null); // Resetting the state for new check

    try {
      const response = await api.post("/validate-nickname", {
        nickname: userData.nickname,
      });
      if (response.data.isDuplicate) {
        setIsNicknameAvailable(false);
      } else {
        setIsNicknameAvailable(true);
      }
    } catch (error) {
      console.error("* 닉네임 중복 확인 중 오류가 발생했습니다:", error);
      setIsNicknameAvailable(false);
    }

    setIsCheckingNickname(false);
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
              onClick={checkNicknameDuplication} // 아직 중복 확인 핸들러 만들지 않음.
              className="check_nickname_button"
              disabled={isCheckingNickname}
            >
              중복 확인
            </button>
          )}
        </div>
        {isNicknameAvailable !== null && (
          <small>
            {isNicknameAvailable
              ? "* 사용 가능한 닉네임입니다."
              : "* 이미 사용 중인 닉네임입니다."}
          </small>
        )}
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
              onInput={handlePasswordInput}
              readOnly={!editMode.profile}
              className={`editable ${editMode.profile ? "" : "readonly"}`}
            />
            {currentPasswordError && (
              <small className="error_message">{currentPasswordError}</small>
            )}
            <label>
              새 비밀번호:
              <input
                type="password"
                name="newPassword"
                value={userData.newPassword}
                onInput={handlePasswordInput}
                onChange={handleInputChange}
                className="editable"
              />
              {newPasswordError && (
                <small className="error_message">{newPasswordError}</small>
              )}
            </label>
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
              <option key={ageObj.age_id} value={ageObj.age}>
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
              <option key={genderObj.gender_id} value={genderObj.gender}>
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
              {currentPasswordError && (
                <small className="error_message">{currentPasswordError}</small>
              )}
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
          <img src={userPicture.profilePicture} alt="Profile" />
          {editMode.profileAndTastes && (
            <div className="profile_picture_container">
              <label className="camera_icon">
                <FaCamera />
                <input type="file" />
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
          개인설정
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
