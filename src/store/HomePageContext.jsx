import { createContext, useReducer } from "react";


export const homePageContext = createContext();

export const HomePageContextProvider = ({ children }) =>{
   
  const INITIAL_STATE= {
    posts: [],
  }

  const dispatchHomePageContext = (state, action) =>{
    switch (action.type) {
      case "POSTS":
        return{
            ...state,
            posts: action.payload.posts,
        };

        default:
          return state;
    }
  }

  const [state, dispatch] = useReducer(dispatchHomePageContext , INITIAL_STATE)

  return (
    <homePageContext.Provider value={{postsdata: state ,dispatch}}>
      {children}
    </homePageContext.Provider>
  ) 
}