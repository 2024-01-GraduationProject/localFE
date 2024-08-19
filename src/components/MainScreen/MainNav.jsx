import React, { useEffect, useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { GiBookshelf } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // Axios 인스턴스 import
import { useAuth } from "AuthContext";
const MainNav = () => {
  const [showCategoryButtons, setShowCategoryButtons] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 책 카테고리 데이터 가져오기
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        console.log(response.data);
        setCategoryOptions(response.data);
      } catch (error) {
        console.log("카테고리 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchCategories();
  }, []);

  const handleHambtnClick = () => {
    setShowCategoryButtons(!showCategoryButtons);
  };

  const getLinkPath = (category) => {
    // category 값이 undefined일 경우 빈 문자열을 반환
    if (!category) return "/";

    const categoryRoutes = {
      로맨스: "romance",
      스릴러: "thriller",
      "공포/호러": "horror",
      SF: "sf",
      판타지: "fantasy",
      고전: "classic",
      역사: "history",
      경제: "economy",
      철학: "philosophy",
      "드라마/영화 원작": "original",
    };

    return `/books/${
      categoryRoutes[category] || category.toLowerCase().replace(/ /g, "-")
    }`;
  };

  const handleCategoryButtonClick = (category) => {
    navigate(getLinkPath(category));
  };

  return (
    <>
      <div className="main_nav">
        <button className="hambtn" onClick={handleHambtnClick}>
          <MdOutlineMenu size="3em" />
        </button>

        <button className="mylib" onClick={() => navigate("/mylib")}>
          <GiBookshelf size="3em" />
        </button>
      </div>

      {showCategoryButtons && (
        <div className="category_buttons">
          {categoryOptions.map((categoryData) => (
            <button
              className="category_button"
              key={categoryData.category_id}
              onClick={() => handleCategoryButtonClick(categoryData.category)}
            >
              {categoryData.category}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default MainNav;
