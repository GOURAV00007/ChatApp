import React from "react";
import "./Messages.css";
import { ChatState } from "../../Context/ChatProvider";
import DisplayMessage from "../DisplayMessage/DisplayMessage.jsx";

function Messages() {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const URL = "http://localhost:8080";
  return (
    <>
      {selectedChat ? (
        <>
          <h3>
            {!selectedChat.isGroupChat ? (
              <>
                {user._id === selectedChat.users[0]._id
                  ? selectedChat.users[1].name
                  : selectedChat.users[0].name}
              </>
            ) : (
              <>{selectedChat.chatName.toUpperCase()}</>
            )}
          </h3>
        </>
      ) : (
        <h4>Select Chat</h4>
      )}
      <DisplayMessage />
    </>
  );
}

export default Messages;
