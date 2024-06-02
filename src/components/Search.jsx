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
import { SocialMediaContext } from "../store/LogicStore";
 
function Search() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(SocialMediaContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") handleSearch();
  };

  const handleSelect = async () => {
    // const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    const combinedId = user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
      }

      const currentUserChatDoc = await getDoc(
        doc(db, "userChats", currentUser.uid)
      );
      if (!currentUserChatDoc.exists()) {
        await setDoc(doc(db, "userChats", currentUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }

      const userChatDoc = await getDoc(doc(db, "userChats", user.uid));
      if (!userChatDoc.exists()) {
        await setDoc(doc(db, "userChats", user.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, "userChats", user.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Error creating chat: ", err);
    }

    setUser(null);
    setUsername("");
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
          onKeyDown={handleKey}
          onChange={(e) => {
            setUsername(e.target.value);
            handleSearch();
          }}
          value={username}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="content-sidebar-submit"
        >
          <IoSearchOutline className="ri-search-line" />
        </button>
      </div>

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
      )}
    </>
  );
}

export default Search;
