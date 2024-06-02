import React, { useContext, useEffect } from "react";
import Chat from "./Chat";
import Sidebar from "./Sidebar";

import "../index.css";

import { ChatContext, ChatContextProvider } from "../store/ChatContext";

import Chats from "./Chats";
import DirectMessage from "./Message/DirectMessage";
import Search from "./Search";
import { BiMessageRoundedError } from "react-icons/bi";
import { SocialMediaContext } from "../store/LogicStore";
import { useNavigate } from "react-router-dom";

function GroupMessage() {
 
  const navigate = useNavigate();
  const {currentUser} = useContext(SocialMediaContext);
  const { data } = useContext(ChatContext);
  useEffect(() => {
    {
      console.log("data for conver", data.chatId);
    }
  }, [data]);


  return (<>
 
    <ChatContextProvider>
      <section className="chat-section">
        <div className="chat-container">
          <Sidebar />

          <div className="chat-content">
            <div className="content-sidebar">
              <Search />
              <Chats />
            </div>

            <DirectMessage />
          </div>
        </div>
      </section>
    </ChatContextProvider>
    </>
  );
}

export default GroupMessage;
