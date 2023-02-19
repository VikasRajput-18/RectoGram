import React, { useEffect, useState } from "react";
import "./Navbar.css";
import PersonImg from "../assets/images/person.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.userReducer?.state);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGIN_ERROR" });

    navigate("/login");
  };

  return (
    <nav className="navbar bg-light shadow">
      <div className="container-fluid ms-1 ms-sm-5 me-1 me-sm-5">
        {storedUser ? (
          <Link to="/" className="navbar-brand logo">
            Rectogram
          </Link>
        ) : (
          <Link to="/login" className="navbar-brand logo">
            Rectogram
          </Link>
        )}
        {storedUser ? (
          <form
            className="d-flex align-items-center gap-4 gap-sm-5"
            role="search"
          >
            <input
              className="form-control me-2 text-muted searchBox d-none d-sm-block"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <i className="fas fa-search px-2 px-1 d-sm-none d-block"></i>
            <Link to="/posts" className="nav-link text-dark" href="#">
              <i className="fas fa-home"></i>
            </Link>
            <Link to="/posts" className="nav-link text-dark" href="#">
              <i className="far fa-heart"></i>
            </Link>
            <div
              className="nav-link text-dark dropdown"
              style={{ cursor: "pointer" }}
            >
              <img
                src={PersonImg}
                alt="PersonImg"
                data-bs-toggle="dropdown"
                className="userProfile"
              />
              <ul
                className="dropdown-menu"
                style={{
                  left: "-120px",
                }}
              >
                <li>
                  <NavLink to="/profile" className="dropdown-item" href="#">
                    Profile
                  </NavLink>
                </li>
                <li onClick={handleLogout}>
                  <Link to="/login" className="dropdown-item" href="#">
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </form>
        ) : (
          ""
        )}
      </div>
    </nav>
  );
};

export default Navbar;
