import React, { useContext, useEffect, useState } from 'react';
import { SocialMediaContext } from '../store/LogicStore';
import { ChatContext } from '../store/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../store/firebaseConfig';

function Chats() {
  const [chats, setChats] = useState({});
  const [loading, setLoading] = useState(true);
  const { dispatch } = useContext(ChatContext);
  const { currentUser } = useContext(SocialMediaContext);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
      const data = doc.data();
      if (data) {
        setChats(data);
      } else {
        setChats({});
      }
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser?.uid]);

  const handleSelect = (userInfo) => {
    console.log("selected data=", userInfo);
    dispatch({ type: "CHANGE_USER", payload: userInfo });
  };

  return (
    <>
      {console.log("current user = ", currentUser)}
      {loading ? (
        <div className="loading">Loading chats...</div>
      ) : (
     
        <div className="content-messages">
          <ul className="content-messages-list">
            {Object.entries(chats)
             .filter(([id, chat]) => chat && chat.date)
              .sort((a, b) => b[1].date - a[1].date)
              .map(([id, chat]) => (
                chat.userInfo && ( 
                  <li key={id} onClick={() => handleSelect(chat.userInfo)}>
                    <a href="#" data-conversation="#conversation-1">
                      <img className="content-message-image" src={chat.userInfo.photoURL} alt="not available" />
                      <span className="content-message-info">
                        <span className="content-message-name">{chat.userInfo.displayName}</span>
                        <span className="content-message-text">{chat.lastMessage?.text}</span>
                      </span>
                      <span className="content-message-more">
                        <span className="content-message-unread">5</span>
                        <span className="content-message-time">12:30</span>
                      </span>
                    </a>
                  </li>
                            )
              )
            )}
          </ul>
        </div>
      )}
    </>
  );
}

export default Chats;
