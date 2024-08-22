import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "AuthContext";
const FamousBook = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // 로그인 페이지로 리다이렉트
      return;
    }

    const fetchUserData = async () => {
      try {
        // API 호출
        const response = await api.get("/user-data", {});

        // 사용자 데이터 설정
        setUserData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { age, gender } = userData;

  return (
    <>
      <div id="famous_book">
        요즘 <strong>{age}</strong> <strong>{gender}</strong>이(가) 많이 보는 책
      </div>
    </>
  );
};

export default FamousBook;
