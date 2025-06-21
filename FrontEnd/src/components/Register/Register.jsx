import React from "react";
import "../Register/Register.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [username, setUserName] = useState("");
  let [password, setPassword] = useState("");
  let [picture, setPicture] = useState(null);
  let [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const URL = "http://localhost:8080";
  let namehandler = (event) => {
    // console.log(event.target.value);
    setName(event.target.value);
  };

  let handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    // console.log(
    //   `Name:${name} UserName:${username} Email:${email} Password:${password} Picture:${picture}`
    // );
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("picture", picture);

    axios
      .post(`${URL}/register`, formData, {
        headers: {
          "content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((result) => {
        if (result.data.success == true) {
          setLoading(false);
          navigate("/");
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
    console.log(data);
  };
  if (loading) return <div>Loading....</div>;
  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 register">
        <form
          className="formRegister"
          onSubmit={handleSubmit}
          enctype="multipart/form-data"
        >
          <div className="mb-3 ">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control inputRegister"
              id="name"
              value={name}
              onChange={namehandler}
            />
            <div className="invalid-feedback">Please Enter Name.</div>
          </div>
          <div className="mb-3 ">
            <label htmlFor="email" className="form-label ">
              Email
            </label>
            <input
              type="email"
              className="form-control inputRegister"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <div className="invalid-feedback">Please Enter Email.</div>
          </div>
          <div className="mb-3 ">
            <label htmlFor="userName" className="form-label">
              UserName
            </label>
            <input
              type="text"
              className="form-control inputRegister"
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
              className="form-control inputRegister"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="invalid-feedback">Please Enter Password.</div>
          </div>
          <div className="mb-3 ">
            <label htmlFor="pic" className="form-label">
              Picture
            </label>
            <input
              type="file"
              className="form-control inputRegister"
              id="pic"
              onChange={(e) => {
                setPicture(e.target.files[0]);
              }}
            />
            <div className="invalid-feedback">Please Enter Picture.</div>
          </div>
          <button type="submit" className="btn btn-primary button">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
