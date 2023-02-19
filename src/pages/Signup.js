import React, { useState } from "react";
import "./Login.css";
import LoginImage from "../assets/images/login_page_image.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";

const Signup = () => {
  const [signupData, setSignupData] = useState({
    phone: "",
    email: "",
    fullName: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { email, fullName, password } = signupData;
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        email,
        fullName,
        password,
      });
      if (response.data) {
        Swal.fire({
          icon: "success",
          title: response.data.msg,
        });
      }

      setLoading(false);
      setSignupData({
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
    <div className="container container_ mt-sm-5">
      <div className="row">
        <div className="col-md-7 mb-3 mb-sm-0">
          <img src={LoginImage} className="w-100" alt="" />
        </div>
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body px-md-5 px-3">
              <h5 className="card-title text-center py-3 fw-bold">Sign Up</h5>
              <form onSubmit={handleSignup}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control input-bg mx-auto"
                    placeholder="Phone"
                    name="phone"
                    value={signupData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control input-bg mx-auto"
                    placeholder="Email"
                    name="email"
                    value={signupData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control input-bg mx-auto"
                    placeholder="Full Name"
                    name="fullName"
                    value={signupData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control input-bg mx-auto"
                    placeholder="Password"
                    name="password"
                    value={signupData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-check my-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label text-muted"
                    htmlFor="flexCheckDefault"
                  >
                    Remember Password
                  </label>
                </div>
                <div className="d-grid mt-3">
                  <button
                    type="submit"
                    className="custom-btn custom-btn-blue"
                    disabled={
                      !signupData.email ||
                      !signupData.password ||
                      !signupData.fullName
                    }
                  >
                    {loading ? (
                      <div className="spinner-border text-light" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      "Sign Up"
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
                    <span className="text-muted">
                      Already have an account ?{" "}
                    </span>
                    <Link to="/login" className="text-decoration-none">
                      <span className="ms-1 text-info fw-bold">Log In</span>
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

export default Signup;
