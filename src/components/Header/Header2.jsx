import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "assets/img/logo.jpg";

const Header2 = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    // 페이지 이동
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <header id="header2" role="banner">
      <div className="header__inner">
        <span className="header__logo">
          <a href="/">
            <img src={logo} alt="로고"></img>
          </a>
        </span>
        <nav className="header__nav" role="navigation" aria-label="로그인 메뉴">
          <ul>
            <li>
              <button
                className="header2_btn"
                onClick={() => handleNavigate("/mypage")}
              >
                MY
              </button>
            </li>
            <span> | </span>
            <li>
              <button className="header2_btn" onClick={handleLogout}>
                LOGOUT
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <hr />
    </header>
  );
};

export default Header2;
