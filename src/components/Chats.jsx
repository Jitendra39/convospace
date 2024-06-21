import React, { useContext, useEffect, useState } from "react";
import { SocialMediaContext } from "../store/GeneralStore";
import { ChatContext } from "../store/ChatContext";
 import '../styles/contentSide.css'

function Chats() {

  const [loading, setLoading] = useState(false);
  const { dispatch, userChats } = useContext(ChatContext);
  const { currentUser } = useContext(SocialMediaContext);


  const handleSelect = (userInfo) => {

    dispatch({ type: "CHANGE_USER", payload: userInfo });
  };

  return (
    <>
 
      {loading ? (
        <div className="loading">Loading chats...</div>
      ) : (
        <div className="content-messages">
          <ul className="content-messages-list">
            {Object.entries(userChats)
              .filter(([id, chat]) => chat && chat.date)
              .sort((a, b) => b[1].date - a[1].date)
              .map(
                ([id, chat]) =>
                  chat.userInfo && (
                    <li key={id} onClick={() => handleSelect(chat.userInfo)}>
                      <a href="#" data-conversation="#conversation-1">
                        <img
                          className="content-message-image"
                          src={chat.userInfo.photoURL}
                          alt="not available"
                        />
                        <span className="content-message-info">
                          <span className="content-message-name">
                            {chat.userInfo.displayName}
                          </span>
                          <span className="content-message-text">
                            {chat.lastMessage?.text}
                          </span>
                        </span>
                        <span className="content-message-more">
                          <span className="content-message-unread">5</span>
                          <span className="content-message-time">12:30</span>
                        </span>
                      </a>
                    </li>
                  )
              )}
          </ul>
        </div>
      )}
    </>
  );
}

export default Chats;
