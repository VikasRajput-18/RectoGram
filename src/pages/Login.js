import React, { useState } from "react";
import "./Login.css";
import LoginImage from "../assets/images/login_page_image.png";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch } from "react-redux";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      if (response.data) {
        localStorage.setItem("token", response.data.result.user.token);
        localStorage.setItem("user", JSON.stringify(response.data.result.user));

        dispatch({ type: "LOGIN_SUCCESS", payload: response.data.result.user });
        navigate("/profile");

        Swal.fire({
          icon: "success",
          title: "Login Successfully",
        });
      }

      setLoading(false);
      setLoginData({
        phone: "",
        email: "",
        fullName: "",
        password: "",
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: error.response.data.error,
      });
    }
  };

  return (
    <div className="container container_">
      <div className="row">
        <div className="col-md-7 mb-3 mb-sm-0">
          <img src={LoginImage} className="w-100" alt="" />
        </div>
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body px-md-5 px-3">
              <h5 className="card-title text-center py-3 fw-bold">Log In</h5>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control input-bg mx-auto"
                    placeholder="Phone number , username or email"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control input-bg mx-auto"
                    placeholder="Password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="d-grid mt-3">
                  <button
                    type="submit"
                    className="custom-btn custom-btn-blue"
                    disabled={!loginData.email || !loginData.password}
                  >
                    {loading ? (
                      <div className="spinner-border text-light" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      "Log In"
                    )}
                  </button>
                </div>

                <div className="d-flex align-items-center gap-3 my-5">
                  <span className="login-line line-1 text-muted"></span>
                  <span className="text-muted">OR</span>
                  <span className="login-line line-2 text-muted"></span>
                </div>

                <div className="mt-3 mb-5 d-grid">
                  <button type="submit" className="custom-btn custom-btn-white">
                    <span className="text-muted">Don't have an account ? </span>
                    <Link to="/signup" className="text-decoration-none">
                      <span className="ms-1 text-info fw-bold">Sign Up</span>
                    </Link>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
