import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { SocialMediaContext } from "./GeneralStore";
import { deleteDoc, deleteField, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [tempChat, setTempChat] = useState();
  const [combinedId, setCombinedId] = useState();
  const { currentUser } = useContext(SocialMediaContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER": {
        setCombinedId(action.payload.combinedId);
        return {
          user: action.payload,
          chatId: action.payload.combinedId,
          change: true,
        };
      }
      default:
        return state;
    }
  };

  useEffect(() => {
    if (currentUser?.uid) {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        const data = doc.data();
        if (data) {
          setChats(data);
        } else {
          setChats({});
        }
        // setLoading(false);
      });

      return () => unsub();
    } else {
      // setLoading(false);
    }
  }, [currentUser?.uid]);

  const temporaryResult = (f) => {
    setTempChat(f);
  };

  const UnfollowRequest = async (userId) => {
    try {

      // delete from userChats (current user)
      const userChatRef1 = doc(db, "userChats", currentUser.uid);
      updateDoc(userChatRef1, {
        [`${combinedId}.userInfo`]: deleteField(),
        [`${combinedId}.date`]: deleteField(),
      });
   
      // delete from userChats (friend)
      const userChatRef2 = doc(db, "userChats",  userId);
      updateDoc(userChatRef2, {
        [`${combinedId}.userInfo`]: deleteField(),
        [`${combinedId}.date`]: deleteField(),
      });

      //delete from chats (all messages )
      await deleteDoc(doc(db, "chats", combinedId))

      console.log("delete successful")
    } catch (err){
      console.log(err)
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider
      value={{
        userChats: chats,
        temporaryResult,
        tempChat,
        data: state,
        dispatch,
        UnfollowRequest,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// chatId: !action.payload.combinedId ? currentUser?.uid > action.payload.uid
// ? currentUser.uid + action.payload.uid
// : action.payload.uid + currentUser.uid : action.payload.combinedId,
