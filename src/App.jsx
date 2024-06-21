import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import { BiMessageRoundedError } from "react-icons/bi";
import { SocialMediaContext } from "./store/GeneralStore";
import { auth } from "./store/firebaseConfig";
import NetworkConnection from "./components/NetworkConnection";

function App() {
  const navigate = useNavigate();
  const { currentUser } = useContext(SocialMediaContext);

  if (!currentUser) {
    navigate("/SignUp");
  }

  

  return (
    <>
      <section className="chat-section">
        <div className="chat-container">
          <Sidebar />
          <div className="chat-content">
            <div className="content-sidebar">
              <Chat />
            </div>
            <div className="conversation conversation-default active">
              <BiMessageRoundedError class="text-6xl" />
              <p>Select chat and view conversation!</p>
            </div>
            <Outlet />
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
