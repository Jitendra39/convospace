import { arrayRemove, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { db } from '../../store/firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
function AllMessages({ message, currentUser, data }) {
  const lastMessageRef = useRef(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
 
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const handleDelete = async (message, currentUser) => {

    
    if (message.senderId === currentUser.uid) {
      const chatDocRef = doc(db, "chats", data.chatId);
      
      try {
        const chatDocSnap = await getDoc(chatDocRef);
       
        if (chatDocSnap.exists()) {
          const chatData = chatDocSnap.data();
          const messages = chatData.messages || [];

          const messageToDelete = messages.find(m => m.id === message.id);

          if (messageToDelete) {
           updateDoc(chatDocRef, {
              messages: arrayRemove(messageToDelete)
            });
 
          }
        }
      } catch (err) {
        console.error("Error deleting message:", err);
      }
    }  
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  return (<>
 
      {message.senderId === currentUser.uid ? (
 
        <li className="conversation-item me"  ref={lastMessageRef}>
         
          <div className="conversation-item-side">
            <img
              className="conversation-item-image"
              src={
                message.senderId === currentUser.uid
                  ? currentUser.photoURL
                  : data.user.photoURL
              }
              alt=""
            />
          </div>
          <div className="conversation-item-content">
            <div className="conversation-item-wrapper">
              <div className="conversation-item-box">
                <div className="conversation-item-text">
                
                    <strong>{message.senderName} </strong>
                    <div className='conversation-text-image'>
                    <div >
                      {message.img && message.type && message.type ==="image" ? (
                      <img
                        src={message.img}
                        alt=""
                        className="MessageWithImg"
                      />
                    ):( message.type && message.type ==="video" &&
                    <video className="Card-Image" autoPlay muted controls>
                    <source src={message.img} type="video/mp4" />
                  </video>
                    )}
                    </div>
                    <div className='messageText'>
                       
                    {message.text}
                    
                    </div>
                   
                  <div
                    className={
                      message.img
                        ? "conversation-item-time-img"
                        : "conversation-item-time"
                    }
                  >
                     
                 {message.time && message.time}
                  </div>
                  </div>
                </div>
                <div className={`conversation-item-dropdown ${dropdownVisible ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="conversation-item-dropdown-toggle"
                    onClick={toggleDropdown}
                  >
                    <BsThreeDotsVertical className="ri-more-2-line" />
                  </button>
                  <ul className="conversation-item-dropdown-list">
                    <li>
                      <a href="#">
                        <i className="ri-share-forward-line"></i> Forward
                      </a>
                    </li>
                    <li onClick={() => handleDelete(message,currentUser)}>
                      <a href="#">
                        <i className="ri-delete-bin-line"></i> Delete
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </li>
      ) : (
        <li className="conversation-item" ref={lastMessageRef}>
          <div className="conversation-item-side">
            <img
              className="conversation-item-image"
              src={
                message.senderId === currentUser.uid
                  ? currentUser.photoURL
                  : data.user.photoURL
              }
              alt=""
            />
          </div>
          <div className="conversation-item-content-receiver">
            <div className="conversation-item-wrapper">
              <div className="conversation-item-box">
                <div className="conversation-item-text-receiver">
                  {/* <p> */}
                  <div>
                    <strong>{message.senderName} </strong>
                    {message.img && message.type && message.type ==="image" ? (
                      <img
                        src={message.img}
                        alt=""
                        className="MessageWithImg"
                      />
                    ):( message.type && message.type ==="video" &&
                      <video width="300" height="200" controls>
                      <source src={message.img} type="video/mp4" />
                      
                    </video>
                    )}
                <div>
                {message.text}
                </div>
                  </div>
                   
                  {/* </p> */}
                  <div
                    className={
                      message.img
                        ? "conversation-item-time-receiver-img"
                        : "conversation-item-time-receiver"
                    }
                  >
                      {message.time && message.time}
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </li>
      )}
    
    </>
  
  );
}

export default AllMessages;