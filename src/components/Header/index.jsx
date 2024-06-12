// Header.js
import React from "react";
import { Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import title from "../../assets/images/LYCmark.png";
import { Link } from "react-router-dom";


const Header = ({ nowDate, isMobileDevice }) => (
  <div className="header-container">
    <div className="df justify-between">
      <Navbar inline="true">
        <img
          className={"titleImg " + (isMobileDevice ? "w40" : "")}
          alt="title"
          src={title}
        />
        <span className={"loginMark " + (isMobileDevice ? "fz30" : "")}>
          LYC株式会社
        </span>
      </Navbar>
    </div>
    <div className="df justify-end header-info">
      <div className={"loginPeople df " + (isMobileDevice ? "fz12" : "")}>
        {nowDate}{" "}
        <FontAwesomeIcon className="fa-fw" size="lg" icon={faUser} />
        スーパ管理 : 社員 - 斉藤真一
      </div>
      <Link
        as="button"
        className={"loginPeople " + (isMobileDevice ? "fz12" : "")}
        to="/"
        id="logout"
      >
        <FontAwesomeIcon className="fa-fw" size="lg" icon={faCaretSquareLeft} />
        sign out
      </Link>
    </div>
  </div>
);

export default Header;
