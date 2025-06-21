import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8080";
const URL = "http://localhost:8080";
var socket, selectedchatcompare;

function DisplayMessage() {
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  useEffect(() => {
    if (!user) return;
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, [user]);
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      event.preventDefault();
      try {
        const { data } = await axios.post(
          `${URL}/messages/sendmessages`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          { withCredentials: true }
        );
        // console.log(data);
        setNewMessage("");
        socket.emit("new message", data);
        setMessage([...message, data]);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const fetchMessage = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const { data } = await axios.get(`${URL}/messages/${selectedChat._id}`, {
        withCredentials: true,
      });
      // console.log(data);
      setMessage(data);
    } catch (err) {
      console.log(err);
    }
    socket.emit("join chat", selectedChat._id);
  };
  useEffect(() => {
    fetchMessage();
    selectedchatcompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      console.log("in message recieved");
      if (
        !selectedchatcompare ||
        selectedchatcompare._id !== newMessageRecieved.chat._id
      ) {
        console.log("error different user");
      } else {
        setMessage([...message, newMessageRecieved]);
      }
    });
  });
  return (
    <>
      <div
        className="d-flex flex-column "
        style={{
          height: "79vh",
          borderRadius: "10px",
          width: "53rem",
          backgroundColor: "#E8E8E8",
        }}
      >
        <div
          style={{
            height: "72vh",
            overflowY: "auto",
          }}
        >
          {message.map((chat, index) => {
            const isUser = String(chat.sender._id) === String(user._id);
            console.log(
              `Message ${index} | content: "${chat.content}" | sender: ${chat.sender._id} | isUser: ${isUser}`
            );
            return (
              <div
                key={index}
                className={`d-flex m-3 ${
                  isUser ? "justify-content-start" : "justify-content-end"
                }`}
              >
                <div
                  className={`p-2 m-1 rounded ${
                    isUser ? "bg-primary" : "bg-secondary"
                  } text-white`}
                  style={{ maxWidth: "60%" }}
                >
                  {chat.content}
                </div>
              </div>
            );
          })}
        </div>
        <form className="ms-3 mb-2" onKeyDown={sendMessage}>
          <div className="row g-0">
            <div className="col-12">
              <input
                className="form-control"
                onChange={typingHandler}
                style={{ color: "black", backgroundColor: "white" }}
                value={newMessage}
              ></input>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default DisplayMessage;
