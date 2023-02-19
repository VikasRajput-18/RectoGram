import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import PostOverview from "./pages/PostOverview";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Error from "./pages/Error";

function App() {
  function DynamicRouting() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const userInfo = useSelector((state) => state.useReducer);

    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("user"));
      console.log(userData);
      if (userData) {
        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
        navigate("/");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGIN_ERROR" });

        navigate("/login");
      }
    }, []);

    return (
      <Routes>
        <Route path="/" element={<PostOverview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/posts" element={<PostOverview />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Error />} />
      </Routes>
    );
  }

  return (
    <div className="app-bg">
      <Navbar />
      <DynamicRouting />
    </div>
  );
}

export default App;
