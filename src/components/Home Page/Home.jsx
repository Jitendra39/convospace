import React, { useContext, useEffect, useState } from "react";
import PostCard from "./PostCard";
import Sidebar from "../Sidebar";
import "./Home.css";
import ToastNotification from "../Message/Notification";
import { SocialMediaContext } from "../../store/GeneralStore";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../store/firebaseConfig";
// import { db, generateToken, messaging } from "../../store/firebaseConfig";
import { homePageContext } from "../../store/HomePageContext";
import FindFriends from "../FindFriends/FindFriends";
// import { onMessage } from "firebase/messaging";
// import toast, { Toaster } from 'react-hot-toast';
function Home() {
  // const {notify, notificationType} = useContext(SocialMediaContext);
  const { notification } = useContext(SocialMediaContext);
  const { dispatch } = useContext(homePageContext);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (notification.notify) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  }, [notification]);

  const getData = async () => {
    try {
      const valRef = collection(db, "PostData");
      const dataDb = await getDocs(valRef);
      const allData = dataDb.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      // Sort by serverTimestamp (most recent first) and then by likes (most liked first)
      allData.sort((a, b) => {
        const likesA = a.likes || 0;
        const likesB = b.likes || 0;
        const timestampA = a.serverTimestamp ? a.serverTimestamp.seconds : 0;
        const timestampB = b.serverTimestamp ? b.serverTimestamp.seconds : 0;
        const dislikesA = a.dislikes || 0;
        const dislikesB = b.dislikes || 0;

        if (likesA !== likesB) {
          return likesB - likesA;
        } else if (timestampA !== timestampB) {
          return timestampB - timestampA;
        } else {
          return dislikesA - dislikesB;
        }
      });

      dispatch({
        type: "POSTS",
        payload: {
          posts: allData,
        },
      });
    } catch (error) {}
  };

  useEffect(() => {
    getData();
  }, []);

  // useEffect(() =>{
  //   generateToken()
  //   onMessage(messaging, (payload) => {
  //     console.log(payload)
  //   toast(payload.notification.body)
  //   })
  // },[])

  return (
    <>
      {showNotification && (
        <div>
          <ToastNotification
            notify={notification.notify}
            notificationType={notification.notificationType}
          />
        </div>
      )}
      <div className="Home-container">
        {notification.progress && notification.progress < 100 && (
          <div className="post-progress-bar">
            <div
              className="progress"
              role="progressbar"
              aria-label="Animated striped example"
              aria-valuenow="75"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                style={{
                  width: `${notification.progress}%`,
                  color: "lightgoldenrodyellow",
                }}
              >
                {Math.round(notification.progress)}%
              </div>
            </div>
          </div>
        )}
        <div className="sub-home-container">
          <div className="Home-header">
            <Sidebar />
          </div>
          <div className="Home-content">{<PostCard />}</div>
          <div className="Recommoded-Friends">
            <FindFriends />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
