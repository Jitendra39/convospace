import React, {
  createContext,
  useState,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { auth, realTimeDataBase } from "./firebaseConfig";
import { get, ref } from "firebase/database";

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
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <SocialMediaContext.Provider
      value={{
        currentUser,
        fetchData,
        isLessThan768,
        isLessThan999,
        notification: state,
        dispatch,
      }}
    >
      {children}
    </SocialMediaContext.Provider>
  );
};
