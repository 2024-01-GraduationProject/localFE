import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header2 from "components/Header/Header2";
import api from "../../api"; // Axios 인스턴스 import
import useAuth from "routes/Login/UseAuth";

const Taste = () => {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useAuth();

  // Join에서 이메일 값 받아오기
  const location = useLocation();
  const { email, password } = location.state || {};

  const [selectedMoods, setSelectedMoods] = useState([]); // 선택된 분위기 저장
  const [selectedAge, setSelectedAge] = useState(""); // 선택된 연령 저장
  const [selectedGender, setSelectedGender] = useState(""); // 선택된 성별 저장

  const [ageOptions, setAgeOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [moodOptions, setMoodOptions] = useState([]);

  useEffect(() => {
    // 연령 데이터 가져오기
    const fetchAges = async () => {
      try {
        const response = await api.get("/ages");
        setAgeOptions(response.data);
      } catch (error) {
        console.log("연령 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    // 성별 데이터 가져오기
    const fetchGenders = async () => {
      try {
        const response = await api.get("/genders");
        setGenderOptions(response.data);
      } catch (error) {
        console.log("성별 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    // 취향 데이터 가져오기
    const fetchMoods = async () => {
      try {
        const response = await api.get("/book-categories");
        setMoodOptions(response.data);
      } catch (error) {
        console.log("취향 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchAges();
    fetchGenders();
    fetchMoods();
  }, []);

  // 분위기 버튼 클릭 핸들러
  const handleMoodClick = (title) => {
    if (selectedMoods.includes(title)) {
      setSelectedMoods(selectedMoods.filter((mood) => mood !== title));
    } else {
      setSelectedMoods([...selectedMoods, title]);
    }
  };

  // 연령 선택 핸들러
  const handleAgeChange = (e) => {
    setSelectedAge(e.target.value); // 선택된 연령으로 설정
  };

  // 성별 선택 핸들러
  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value); // 선택된 성별로 설정
  };

  // 다음으로 버튼 클릭 시 서버로 데이터 전송
  const handleTasteSubmit = async () => {
    try {
      const response = await api.post("/save-taste", {
        email,
        age: selectedAge,
        gender: selectedGender,
        mood: selectedMoods,
      });
      if (response.status === 200) {
        console.log("선택된 정보가 서버에 전송되었습니다.");
        navigate("/tastenext", { state: { email, password } });
      } else {
        alert(`서버로 데이터 전송 실패: ${response.data.message}`);
      }
    } catch (error) {
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Header2 />
      <div id="taste">
        <div className="taste_text">여러분의 독서 취향을 알려주세요!</div>
        <div className="select_taste">
          <div>연령/성별</div>
          <select
            className="selectAge"
            onChange={handleAgeChange}
            value={selectedAge}
          >
            <option value="">연령 선택</option>
            {ageOptions.map((taste) => (
              <option key={taste.age} value={taste.age}>
                {taste.age}
              </option>
            ))}
          </select>

          <select
            className="selectGender"
            onChange={handleGenderChange}
            value={selectedGender}
          >
            <option value="">성별 선택</option>
            {genderOptions.map((taste) => (
              <option key={taste.gender} value={taste.gender}>
                {taste.gender}
              </option>
            ))}
          </select>
        </div>

        <div className="mood">
          <div>유형(분위기)</div>
          {moodOptions.map((taste) => (
            <button
              key={taste.id}
              className={
                selectedMoods.includes(taste.category) ? "selected" : ""
              }
              onClick={() => handleMoodClick(taste.category)}
            >
              #{taste.category}
            </button>
          ))}
        </div>

        <div>
          <button className="nextbtn" onClick={handleTasteSubmit}>
            {">"} 다음으로
          </button>
        </div>
      </div>
    </>
  );
};

export default Taste;
