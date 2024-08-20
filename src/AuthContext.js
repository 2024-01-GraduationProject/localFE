import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null); // 사용자 ID를 상태로 추가
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      fetchUserInfo();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get("/user-data"); // 사용자 정보 API 엔드포인트
      if (response.status === 200) {
        setUserId(response.data.userId); // 사용자 ID 설정
      } else {
        console.error("Failed to fetch user info.");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const login = (token) => {
    setIsAuthenticated(true);
    //localStorage.setItem("authToken", "dummy_token");
    localStorage.setItem("authToken", token);

    // 사용자 정보를 API에서 가져옵니다
    fetchUserInfo();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
