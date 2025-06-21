import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";

function GroupModal() {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { user, chats, setChats } = ChatState();

  const URL = "http://localhost:8080";
  let handleSearch = async (value) => {
    setSearch(value);
    if (!value) {
      return;
    }
    try {
      await axios
        .get(`${URL}/chats/search?search=${search}`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data.data);
          setSearchResult(res.data.data);
        });
    } catch (error) {
      console.log(error);
    }
  };
  let handleClick = (userToAdd, e) => {
    e.preventDefault();
    if (!selectedUsers.includes(userToAdd)) {
      setSelectedUsers([...selectedUsers, userToAdd]);
    }
  };
  let handleDelete = (userToDelete, e) => {
    e.preventDefault();
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToDelete._id)
    );
  };
  let handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupChatName || !selectedUsers) {
      alert("Enter the Fields");
      return;
    }
    try {
      await axios.post(
        `${URL}/chats/createGroupChat`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        {
          withCredentials: true,
        }
      );
      setChats([data, ...chats]);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <button
        className="btn btn-outline-info"
        data-bs-toggle="modal"
        data-bs-target="#groupChat"
      >
        Group
      </button>

      {/* Group Chat modal */}
      <div
        className="modal fade"
        id="groupChat"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Create Group
              </h1>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-3">
                    <label htmlFor="name">Name</label>
                  </div>
                  <div className="col-9">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={groupChatName}
                      onChange={(e) => {
                        setGroupChatName(e.target.value);
                      }}
                    ></input>
                  </div>
                </div>
              </form>
              <form className="mt-3">
                <div className="row">
                  <div className="col-3">
                    <label htmlFor="name">Search</label>
                  </div>
                  <div className="col-9">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={search}
                      onChange={(e) => {
                        handleSearch(e.target.value);
                      }}
                    ></input>
                  </div>
                </div>
                <div className="mt-3">
                  {" "}
                  {selectedUsers.map((user) => (
                    <span className="bg-info m-1 rounded p-2" key={user._id}>
                      <small>{user.name}</small>
                      <i
                        className="fa-solid fa-xmark ms-2"
                        onClick={(e) => {
                          handleDelete(user, e);
                        }}
                      ></i>
                    </span>
                  ))}
                </div>

                {searchResult.length > 0 && (
                  <div className="list-group mt-5 position-absolute w-40 shadow">
                    {searchResult.map((user) => (
                      <div
                        key={user._id}
                        className="list-group-item list-group-item-action"
                      >
                        <strong>{user.name}</strong> -{" "}
                        <small>{user.email}</small>
                        <button
                          className="btn btn-info m-2"
                          onClick={(e) => {
                            handleClick(user, e);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-info"
                data-bs-dismiss="modal"
                onClick={handleSubmit}
              >
                Create Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupModal;
