import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header2 from "components/Header/Header2";
import api from "../../api"; // Axios 인스턴스 import
import { useAuth } from "AuthContext";

const Taste = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Join에서 이메일 값 받아오기
  const location = useLocation();
  const { email, password } = location.state || {};

  const [selectedBookTastes, setSelectedBookTastes] = useState([]); // 선택된 분위기 저장
  const [selectedAge, setSelectedAge] = useState(""); // 선택된 연령 저장
  const [selectedGender, setSelectedGender] = useState(""); // 선택된 성별 저장

  const [ageOptions, setAgeOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [bookCategoryOptions, setBookCategoryOptions] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 인증되지 않은 사용자가 접근할 수 없도록 리디렉션
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

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
    // 연령과 성별이 선택되지 않았을 때
    if (!selectedAge || !selectedGender) {
      setErrorMessage("연령과 성별을 모두 선택해주세요.");
      alert("연령과 성별을 모두 선택해주세요.");
      return;
    } else if (selectedBookTastes.length === 0) {
      setErrorMessage("독서 취향을 선택해주세요.");
      alert("독서 취향을 선택해주세요.");
      return;
    }

    // 오류 메시지 초기화
    setErrorMessage("");

    try {
      const response = await api.post("/save-taste", {
        email,
        age: selectedAge,
        gender: selectedGender,
        bookTaste: selectedBookTastes,
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
            <option value="" disabled>
              연령 선택
            </option>
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
            <option value="" disabled>
              성별 선택
            </option>
            {genderOptions.map((taste) => (
              <option key={taste.gender_id} value={taste.gender}>
                {taste.gender}
              </option>
            ))}
          </select>
        </div>

        <div className="mood">
          <div>취향(카테고리)</div>
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
