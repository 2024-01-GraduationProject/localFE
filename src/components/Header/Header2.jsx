import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "assets/img/logo.jpg";

const Header2 = () => {
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
              <Link to="/mypage">My</Link>
            </li>
            <li>
              | <a>LOGOUT</a>
            </li>
          </ul>
        </nav>
      </div>
      <hr />
    </header>
  );
};

export default Header2;
