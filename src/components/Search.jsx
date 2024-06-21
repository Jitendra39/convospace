import { IoSearchOutline } from "react-icons/io5";
import React, { useContext, useState } from "react";
import { ChatContext } from "../store/ChatContext";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../store/firebaseConfig";
import { SocialMediaContext } from "../store/GeneralStore";
 
function Search() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(SocialMediaContext);

  const handleSearch = async () => {
    
  };

  const handleKey = (e) => {
    if (e.code === "Enter") handleSearch();
  };

  const handleSelect = async () => {
       
  };



  return (
    <>
  
      <div className="content-sidebar-title">
        <div>Chats</div>
      </div>
      <div className="content-sidebar-form">
        <input
          type="text"
          className="content-sidebar-input"
          placeholder="Search User"
         />
        <button
          type="button"
          className="content-sidebar-submit"
        >
          <IoSearchOutline className="ri-search-line" />
        </button>
      </div>
{/* 
      {err && <span>User not found!</span>}
      {user && (
        <div className="content-messages">
          <ul className="content-messages-list">
            <li onClick={handleSelect}>
              <a href="#" data-conversation="#conversation-1">
                <img
                  className="content-message-image"
                  src={user.photoURL}
                  alt=""
                />
                <span className="content-message-info">
                  <span className="content-message-name">
                    {user.displayName}
                  </span>
                  <span className="content-message-text">
                    Lorem ipsum dolor sit amet consectetur.
                  </span>
                </span>
                <span className="content-message-more">
                  <span className="content-message-unread">5</span>
                  <span className="content-message-time">12:30</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      )} */}
    </>
  );
}

export default Search;
