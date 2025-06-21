import React from "react";
import Search from "../Search/Search";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Details from "../Details/Details";

function Navbar() {
  const { user, setUser } = ChatState({});
  const navigate = useNavigate();
  const URL = "https://chatapp-2411.onrender.com";
  let handleLogOut = async (e) => {
    await axios
      .get(`${URL}/logout`, { withCredentials: true })
      .then((res) => {
        console.log(res);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary me-1">
        <div className="container-fluid">
          {/* Toggler for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-between"
            id="navbarSupportedContent"
          >
            <Search />
            <div className="d-none d-lg-block">
              <h4 className="text-primary">Chat</h4>
            </div>
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {/* {user.username} */}
                  <img
                    src={user.pic.url}
                    alt="Profile"
                    height="30"
                    width="30"
                    className="rounded-circle"
                  />
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link
                      className="dropdown-item"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      Full Details
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" onClick={handleLogOut}>
                      LogOut
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1
                class="modal-title fs-5 d-block mx-auto"
                id="exampleModalLabel"
              >
                {user.name}
              </h1>
            </div>
            <div class="modal-body">
              <img
                src={user.pic.url}
                alt="Profile"
                height="200"
                width="200"
                className="rounded-circle d-block mx-auto"
              ></img>
              <h1 className="d-block mx-auto mt-3">Email:{user.email}</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
