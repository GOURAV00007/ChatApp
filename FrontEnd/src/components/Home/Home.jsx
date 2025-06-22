import React, { useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Chats from "../Chats/Chats";
import Messages from "../Messages/Messages";
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";

function Home() {
  // const { user } = ChatState();
  // console.log(user);
  const { user, loading } = ChatState({});

  // if (!user) {
  //   return <Navigate to="/login" />;
  // }
  useEffect(() => {
  alert(JSON.stringify(user));
    console.log("loggedinuser",user);
}, [user]);
  console.log("App rendering: user =", user, "loading =", loading);
  if (loading) return <div>Loading...</div>;
  return (
    <>
      <Navbar />
      <div className="row g-1">
        <div className="col-4">
          <Chats />
        </div>
        <div className="col-8">
          {" "}
          <Messages />
        </div>
      </div>
    </>
  );
}

export default Home;
