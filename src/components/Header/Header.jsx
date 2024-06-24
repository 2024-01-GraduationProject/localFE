import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "assets/img/logo.jpg";

const Header = () => {
  return (
    <header id="header" role="banner">
      <div className="header__inner">
        <span className="header__logo">
          <a href="/">
            <img src={logo} alt="로고"></img>
          </a>
        </span>
        <nav className="header__nav" role="navigation" aria-label="로그인 메뉴">
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
      </div>
      <hr />
    </header>
  );
};

export default Header;
