import React, { useContext, useEffect, useRef, useState } from "react";
import css from "./NotificationTab.module.css";
import { SocialMediaContext } from "../../store/GeneralStore";
import Sidebar from "../Sidebar";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, realTimeDataBase } from "../../store/firebaseConfig";
import { ref, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../General/LoadingSpinner";
import "../../styles/common.css";

function NotificationTab({ setNotificationTab, notificationTab }) {
  const [allRequests, setAllRequests] = useState([]);
  const navigate = useNavigate();
  const NotificationTabClickRef = useRef();
  const [showSpinner, setShowSpinner] = useState(false);
  const { isLessThan768, currentUser, fetchData } =
    useContext(SocialMediaContext);

  const handleClickOutSide = (event) => {
    if (
      NotificationTabClickRef.current &&
      !NotificationTabClickRef.current.contains(event.target)
    ) {
      setNotificationTab(false);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      if (currentUser) {
        const request = await fetchData(currentUser);
        setAllRequests(request);
      }
    };
    fetchRequests();
  }, [notificationTab, currentUser, fetchData]);

  useEffect(() => {
    if (notificationTab) {
      document.addEventListener("mousedown", handleClickOutSide);
    } else {
      document.removeEventListener("mousedown", handleClickOutSide);
    }

    return () => {
      document.addEventListener("mousedown", handleClickOutSide);
    };
  }, [notificationTab]);

  const handleSelect = async (user) => {
    setShowSpinner(true);
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
            combinedId,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            combinedId,
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
            combinedId,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, "userChats", user.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            combinedId,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }
      RejectRequest(user);
      setShowSpinner(false);
    } catch (err) {
      setShowSpinner(false);
    }
  };

  async function RejectRequest(user) {
    const dataRef = ref(
      realTimeDataBase,
      `notification/${currentUser.uid}/${user.uid}`
    );
    try {
      await remove(dataRef);
      setNotificationTab(false);
    } catch (err) {}
  }

  return (
    <>
      {isLessThan768 && <Sidebar />}
      {showSpinner ? (
        <div className="loadingSpinner">
          <LoadingSpinner />
        </div>
      ) : (
        <div className={css.notificationTabMain}>
          <div
            className={css.subNotificationTabMain}
            ref={NotificationTabClickRef}
          >
            <h2>Notifications</h2>
            <div className={css.contentMessages}>
              {allRequests &&
                allRequests.map(([key, req]) => (
                  <ul className={css.contentMessagesList}>
                    <li className={css.contentMessagesListItem} key={key}>
                      <a href="#" data-conversation="#conversation-1">
                        <img
                          className={css.contentMessageImage}
                          src={req.photoURL}
                          alt="not available"
                        />
                        <span className={css.contentMessageInfo}>
                          <span className={css.contentMessageName1}>
                            {req.displayName}
                          </span>
                          <span className={css.contentMessageText}>
                            Not available
                          </span>
                        </span>

                        <span className={css.contentMessageMore}>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => RejectRequest(req)}
                          >
                            Reject
                          </button>
                        </span>

                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => handleSelect(req)}
                        >
                          Accept
                        </button>
                      </a>
                    </li>
                  </ul>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NotificationTab;
