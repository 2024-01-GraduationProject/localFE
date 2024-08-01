import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  //const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      //setAuthToken(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (token) => {
    setIsAuthenticated(true);
    //setAuthToken(token);
    localStorage.setItem("authToken", "dummy_token");
  };

  const logout = () => {
    setIsAuthenticated(false);
    //setAuthToken(null);
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
