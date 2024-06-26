import React, { useContext, useEffect } from "react";
import Chat from "./Chat";
import Sidebar from "./Sidebar";

import "../index.css";

import { ChatContext, ChatContextProvider } from "../store/ChatContext";

import Chats from "./Chats";
import DirectMessage from "./Message/DirectMessage";
import Search from "./Search";
import { BiMessageRoundedError } from "react-icons/bi";
import { SocialMediaContext } from "../store/GeneralStore";
import { useNavigate, useParams } from "react-router-dom";

function DirectConversation() {
  const navigate = useNavigate();
  // const {id} = useParams();
  const { currentUser } = useContext(SocialMediaContext);
  const { data } = useContext(ChatContext);
 

  return (
    <>
 
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

export default DirectConversation;
