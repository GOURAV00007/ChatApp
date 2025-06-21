import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Login/Login.css";
import { ChatState } from "../../Context/ChatProvider";
import { Link } from "react-router-dom";

function Login() {
  let [username, setUserName] = useState("");
  let [password, setPassword] = useState("");
  const URL = "https://chatapp-2411.onrender.com";
  const { user, setUser } = ChatState({});
  const navigate = useNavigate();
  let handleSubmit = (event) => {
    console.log("In Handle submit");
    event.preventDefault();
    axios
      .post(
        `${URL}/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .then((result) => {
        console.log("After post");
        if (result.data.success == true) {
          setUser(result.data.data);
          navigate("/home");
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("Invalid username or password");
        } else {
          console.log("Login error:", err);
          alert("Something went wrong. Try again.");
        }
      });
  };
  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 login">
        <form className="formlogin" onSubmit={handleSubmit}>
          <div className="mb-3 ">
            <label htmlFor="userName" className="form-label">
              UserName
            </label>
            <input
              type="text"
              className="form-control inputLogin"
              id="userName"
              value={username}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            <div className="invalid-feedback">Please Enter UserName.</div>
          </div>
          <div className="mb-3 ">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control inputLogin"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="invalid-feedback">Please Enter Password.</div>
            <div className="mt-3">
              <Link to="/register">Register</Link>
            </div>
          </div>
          <button type="submit" className="btn btn-primary button">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
