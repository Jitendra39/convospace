// LogicStore.jsx
import React, { createContext, useState, useEffect } from "react";
import { auth } from "./firebaseConfig";

export const SocialMediaContext = createContext();

export const SocialMediaContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);  
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);  
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <SocialMediaContext.Provider value={{ currentUser }}>
      {children}
    </SocialMediaContext.Provider>
  );
};
