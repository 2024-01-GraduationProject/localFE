import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header2 from "components/Header/Header2";
import api from "../../api"; // Axios 인스턴스 import
import { useAuth } from "AuthContext";

const Taste = () => {
  const navigate = useNavigate();
  const { authToken } = useAuth();

  // Join에서 이메일 값 받아오기
  const location = useLocation();
  const { email, password } = location.state || {};

  const [selectedBookTastes, setSelectedBookTastes] = useState([]); // 선택된 분위기 저장
  const [selectedAge, setSelectedAge] = useState(""); // 선택된 연령 저장
  const [selectedGender, setSelectedGender] = useState(""); // 선택된 성별 저장

  const [ageOptions, setAgeOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [bookCategoryOptions, setBookCategoryOptions] = useState([]);

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
    const fetchBookCategory = async () => {
      try {
        const response = await api.get("/categories");
        console.log("bookCategory options:", response.data);
        setBookCategoryOptions(response.data);
      } catch (error) {
        console.log("취향 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchAges();
    fetchGenders();
    fetchBookCategory();
  }, []);

  // 분위기 버튼 클릭 핸들러
  const handleBookTasteClick = (title) => {
    if (selectedBookTastes.includes(title)) {
      setSelectedBookTastes(
        selectedBookTastes.filter((taste) => taste !== title)
      );
    } else {
      setSelectedBookTastes([...selectedBookTastes, title]);
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
      const response = await api.post(
        "/save-taste",
        {
          email,
          age: selectedAge,
          gender: selectedGender,
          bookTaste: selectedBookTastes,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // AuthContext에서 가져온 토큰을 헤더에 포함
          },
        }
      );
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
              <option key={taste.age_id} value={taste.age}>
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
              <option key={taste.gender_id} value={taste.gender}>
                {taste.gender}
              </option>
            ))}
          </select>
        </div>

        <div className="mood">
          <div>유형(분위기)</div>
          {bookCategoryOptions.length > 0 ? (
            bookCategoryOptions.map((taste) => (
              <button
                key={taste.category_id}
                className={
                  selectedBookTastes.includes(taste.category) ? "selected" : ""
                }
                onClick={() => handleBookTasteClick(taste.category)}
              >
                #{taste.category}
              </button>
            ))
          ) : (
            <div>취향 옵션을 불러오는 중...</div>
          )}
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
