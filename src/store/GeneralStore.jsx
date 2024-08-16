import React, {
  createContext,
  useState,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { auth, db, realTimeDataBase } from "./firebaseConfig";
import { child, get, onValue, ref, remove, set } from "firebase/database";
import Swal from "sweetalert2";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";

export const SocialMediaContext = createContext();

export const SocialMediaContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const INITIAL_STATE = {
    notify: "",
    notificationType: "",
    progress: "",
    posts: [],
  };

  // Reducer function to handle notification state changes
  const dispatchContext = (state, action) => {
    switch (action.type) {
      case "NOTIFY":
        return {
          ...state,
          notify: action.payload.notify,
          notificationType: action.payload.notificationType,
        };

      case "PROGRESS":
        return {
          ...state,
          progress: action.payload.progress,
        };

      case "POSTS":
        return {
          ...state,
          posts: action.payload.posts,
        };

      default:
        return state;
    }
  };

  // useReducer hook for notification state management
  const [state, dispatch] = useReducer(dispatchContext, INITIAL_STATE);

  // useEffect to handle authentication state
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const [isLessThan768, setIsLessThan768] = useState(window.innerWidth < 768);
  const [isLessThan999, setIsLessThan999] = useState(window.innerWidth < 1000);
  useEffect(() => {
    function updateWindowSize() {
      setIsLessThan768(window.innerWidth < 768);
      setIsLessThan999(window.innerWidth < 768);
    }
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  // Loading indicator while authentication state is being determined
  if (loading) {
    return <div>Loading...</div>;
  }

  const fetchData = async (currentUser) => {
    if (!currentUser) {
      return;
    }
    const dbRef = ref(realTimeDataBase, "notification/" + currentUser.uid);
    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).filter(([key, uid]) => uid);
        return data;
      } else {
      }
    } catch (err) {}
  };

  //--------------------   Game Start Logic ---------------------//
  const handleGameRequest = (oppData) => {
    const dataRef = ref(
      realTimeDataBase,
      `GameRequest/${oppData.user.uid}/${currentUser.uid}`
    );

    set(dataRef, {
      p1Uid: currentUser.uid,
      p1Name: currentUser.displayName,
      p1Status: true,
      p2Uid: oppData.user.uid,
      p2Name: oppData.user.displayName,
      p2Status: false,
    })
      .then(() => {
        successAlert(
          `Play request has been sent to ${oppData.user.displayName}!  Please refresh the page to start the game.`
        );
      })
      .catch((err) => {});
  };

  const gameCheck = async (data) => {
    const dbRef = ref(realTimeDataBase, `GameRequest/${data.uid}`);
    return new Promise((resolve, reject) => {
      onValue(
        dbRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            resolve(data);
          } else {
            resolve(null);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handleDeleteGameRequest = (p1, p2) => {
    const dataRef = ref(realTimeDataBase, `GameRequest/${p2}/${p1}`);
    try {
      remove(dataRef);
      return "del";
    } catch (err) {}
  };

  const successAlert = (message) => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 1800,
    });
  };

  const handleClickCopy = async (mess) => {
    await navigator.clipboard.writeText(mess);
  };




  // -----------------------  Search User ---------------------//
  const handleSearchUser = async (username) => {
    return new Promise(async (resolve, reject) => {

		if(!username) return;
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username),
    );
 
    const q2 = query(
      collection(db, "users"),
      where("uid", "==", username),
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
       resolve(doc.data());
      });
    } catch (err) {
     
    }

    try {
      const querySnapshot = await getDocs(q2);
      querySnapshot.forEach((doc) => {
       resolve(doc.data());
      });
    } catch (err) {
       
    }
  })
  };


  return (
    <SocialMediaContext.Provider
      value={{
        handleSearchUser,
        handleClickCopy,
        successAlert,
        handleDeleteGameRequest,
        handleGameRequest,
        currentUser,
        fetchData,
        isLessThan768,
        isLessThan999,
        notification: state,
        dispatch,
        gameCheck,
      }}
    >
      {children}
    </SocialMediaContext.Provider>
  );
};
