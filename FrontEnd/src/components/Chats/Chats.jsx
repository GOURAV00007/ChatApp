import React from "react";
import "./Chats.css";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { useEffect } from "react";
import { useState } from "react";
import GroupModal from "../GroupModal/GroupModal";
function Chats() {
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [loggedUser, setloggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const URL = "https://chatapp-2411.onrender.com";

  let fectchChats = async (e) => {
    setLoading(true);
    console.log("INside Fecth");
    await axios
      .get(`${URL}/chats/fetechChats`, { withCredentials: true })
      .then((res) => {
        console.log("Inside Fecth data:",res.data.data);
        setChats(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("After fetching");
      setLoading(false);
  };
  useEffect(() => {
    axios
      .get("https://chatapp-2411.onrender.com/debug/session", {
        withCredentials: true
      })
      .then((res) => {
        console.log("✅ Debug Session Response:", res.data);
      })
      .catch((err) => {
        console.error("❌ Session check failed", err);
      });
    fectchChats();
    setloggedUser(user);
  }, []);
  useEffect(() => {
    console.log("Updated Chats:", chats);
  }, [chats]);
  let selectChat = (chat, e) => {
    e.preventDefault();
    setSelectedChat(chat);
  };
  if (loading) return <div>Loading....</div>;
  return (
    <>
      <div className="border box">
        <div className="card">
          <div className="card-body d-flex justify-content-between align-items-center ">
            <span className="fs-4 ">Chats</span>
            <GroupModal />
          </div>
        </div>

        {chats && chats.length > 0 ? (
          chats.map((chat) => (
            <div
              className="card m-1"
              key={chat._id}
              onClick={(e) => {
                selectChat(chat, e);
              }}
            >
              <div className="card-body">
                {!chat.isGroupChat
                  ? loggedUser._id === chat.users[0]._id
                    ? chat.users[1].name
                    : chat.users[0].name
                  : chat.chatName}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-3">No chats found</div>
        )}
      </div>
    </>
  );
}

export default Chats;
