import React, { useContext, useState } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

function Search() {
  let [search, setSearch] = useState("");
  let [userData, setUserData] = useState([]);
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const URL = "https://chatapp-2411.onrender.com";
  // let [userId, setUserId] = useState();
  let handleSubmit = async (event) => {
    event.preventDefault();
    await axios
      .get(`https://chatapp-2411.onrender.com/chats/search?search=${search}`, {
        withCredentials: true,
      })
      .then((res) => {
        setUserData(res.data.data);
        alert(res.data.success);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  let handleClick = async (userId) => {
    axios
      .get(`${URL}/chats/accessChat`, {
        params: { userId },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.data[0]);
        let data = res.data.data[0];
        if (!chats.find((c) => c._id === data._id)) {
          setChats([data, ...chats]);
        }
        setSelectedChat(res.data.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <form className="d-flex" role="search" onSubmit={handleSubmit}>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <button className="btn btn-outline-success" type="submit">
        Search
      </button>
      {/* Search Results List */}
      {userData.length > 0 && (
        <div
          className="list-group mt-5 position-absolute w-40 shadow"
          style={{ zIndex: 9999 }}
        >
          {userData.map((user) => (
            <div
              key={user._id}
              className="list-group-item list-group-item-action"
            >
              <strong>{user.name}</strong> - <small>{user.email}</small>
              <button
                className="btn btn-info m-2"
                onClick={() => {
                  handleClick(user._id);
                  setUserData([]);
                }}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}

export default Search;
