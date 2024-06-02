import { createContext, useContext, useReducer } from "react";

import {SocialMediaContext} from './LogicStore';

export const ChatContext = createContext();


export const ChatContextProvider = ({ children }) => {
  const {currentUser } = useContext(SocialMediaContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {
        
     }
  };


  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:currentUser.uid > action.payload.uid
            ? currentUser.uid + action.payload.uid
            : action.payload.uid + currentUser.uid,
           
          change: true,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data:state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};


/// previous
// chatId: user.uid + currentUser.uid;
// currentUser.uid > action.payload.uid
//   ? currentUser.uid + action.payload.uid
//   : action.payload.uid + currentUser.uid,