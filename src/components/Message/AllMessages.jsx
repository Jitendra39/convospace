import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { db } from "../../store/firebaseConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../styles/AllMessage.module.css";
import { SocialMediaContext } from "../../store/GeneralStore";
import { useNavigate } from "react-router-dom";
import { deleteMessage } from "../GroupChat/GroupChatLogic";

function AllMessages({
  message,
  currentUser,
  data,
  groupId,
  handleDeleteElementOfArray,
}) {
  const navigate = useNavigate();
  const lastMessageRef = useRef(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [imgClicked, setImgClicked] = useState(false);
  const { handleClickCopy } = useContext(SocialMediaContext);
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleImageSize = () => {
    setImgClicked(!imgClicked);
  };

  const handleDelete = async (message, currentUser) => {
    if (message.senderId === currentUser.uid) {
      if (!message.dates) {
        const chatDocRef = doc(db, "chats", data.chatId);
        try {
          const chatDocSnap = await getDoc(chatDocRef);

          if (chatDocSnap.exists()) {
            const chatData = chatDocSnap.data();
            const messages = chatData.messages || [];

            const messageToDelete = messages.find((m) => m.id === message.id);

            if (messageToDelete) {
              updateDoc(chatDocRef, {
                messages: arrayRemove(messageToDelete),
              });
            }
          }
        } catch (err) {}
      } else {
        deleteMessage(message.dates, groupId);
        handleDeleteElementOfArray(message);
      }
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  return (
    <>
      {message.senderId === currentUser.uid ? (
        <li
          className={`${styles["conversation-item"]} ${styles.me}`}
          ref={lastMessageRef}
        >
          <div className={styles["conversation-item-side"]}>
            <img
              onClick={() => {
                message.dates && navigate(`/Profile/${message.senderId}`);
              }}
              className={styles["conversation-item-image"]}
              src={
                message.senderId === currentUser.uid
                  ? currentUser.photoURL
                  : data && data.user.photoURL
              }
              alt=""
            />
          </div>
          <div className={styles["conversation-item-content"]}>
            <div className={styles["conversation-item-wrapper"]}>
              <div className={styles["conversation-item-box"]}>
                <div className={styles["conversation-item-text"]}>
                  <strong>{message.senderName} </strong>
                  <div className={styles["conversation-text-image"]}>
                    <div>
                      {message.img && message.type === "image" ? (
                        <img
                          src={message.img}
                          alt=""
                          className={`${styles["messageImg"]} ${
                            imgClicked ? styles["clickedImg"] : ""
                          }`}
                          onClick={toggleImageSize}
                        />
                      ) : (
                        message.type === "video" && (
                          <video
                            className={styles["Card-Image"]}
                            autoPlay
                            muted
                            controls
                          >
                            <source src={message.img} type="video/mp4" />
                          </video>
                        )
                      )}
                    </div>
                    <div className={styles["messageText"]}>{message.text}</div>
                    <div
                      className={
                        message.img
                          ? styles["conversation-item-time-img"]
                          : styles["conversation-item-time"]
                      }
                    >
                      {message.time && message.time}
                    </div>
                  </div>
                </div>
                <div
                  className={`${styles["conversation-item-dropdown"]} ${
                    dropdownVisible ? styles["active"] : ""
                  }`}
                >
                  <button
                    type="button"
                    className={styles["conversation-item-dropdown-toggle"]}
                    onClick={toggleDropdown}
                  >
                    <BsThreeDotsVertical className="ri-more-2-line" />
                  </button>
                  <ul className={styles["conversation-item-dropdown-list"]}>
                    <li style={{ paddingLeft: "0" }}>
                      <a>
                        <i className="ri-share-forward-line"></i> Forward
                      </a>
                    </li>
                    <li onClick={() => handleDelete(message, currentUser)}>
                      <a href="#">
                        <i className="ri-delete-bin-line"></i> Delete
                      </a>
                    </li>
                    <li onClick={() => handleClickCopy(message.text)}>
                      <a href="#">
                        <i className="ri-delete-bin-line"></i> Copy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </li>
      ) : (
        <li className={styles["conversation-item"]} ref={lastMessageRef}>
          <div className={styles["conversation-item-side"]}>
            <img
              onClick={() => {
                message._id && navigate(`/Profile/${message.senderId}`);
              }}
              className={styles["conversation-item-image"]}
              src={
                message.senderId === currentUser.uid
                  ? currentUser.photoURL
                  : data
                  ? data.user.photoURL
                  : message.photoURL
              }
              alt=""
            />
          </div>
          <div className={styles["conversation-item-content-receiver"]}>
            <div className={styles["conversation-item-wrapper"]}>
              <div className={styles["conversation-item-box"]}>
                <div className={styles["conversation-item-text-receiver"]}>
                  <div>
                    {message.img && message.type === "image" ? (
                      <img
                        src={message.img}
                        alt=""
                        className={`${styles["messageImg"]}`}
                        onClick={toggleImageSize}
                      />
                    ) : (
                      message.type === "video" && (
                        <video width="300" height="200" controls>
                          <source src={message.img} type="video/mp4" />
                        </video>
                      )
                    )}
                    <div>{message.text}</div>
                  </div>
                  <div
                    className={
                      message.img
                        ? styles["conversation-item-time-receiver-img"]
                        : styles["conversation-item-time-receiver"]
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
