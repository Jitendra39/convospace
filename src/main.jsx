import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { SocialMediaContextProvider } from "./store/GeneralStore.jsx";
import DirectConversation from "./components/directConversation.jsx";
 
import Login from "./components/Login.jsx";
import Auth from "./components/Auth.jsx";
import { ChatContextProvider } from "./store/ChatContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Profile from "./components/Profile/Profile.jsx";
import Home from "./components/Home Page/Home.jsx";
import CreatePost from "./components/Home Page/CreatePost.jsx";
import { HomePageContextProvider } from "./store/HomePageContext.jsx";
import User from "./components/User.jsx";
import FindFriends from "./components/FindFriends/FindFriends.jsx";
import NotificationTab from "./components/NotificationTab/NotificationTab.jsx";
import TicTacToe from "./components/Games/Tic_Tac_Toe/TicTacToe.jsx";
import GroupChatMain from "./components/GroupChat/GroupChatMain.jsx";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <SocialMediaContextProvider>
    <ChatContextProvider>
      <HomePageContextProvider>
        <Router>
          <Routes>
          
              <Route path="/" element={<Home />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Games" element={<TicTacToe />} />
              <Route path="/SignUp" element={<Auth />} />
              <Route path="/User/:id" element={<User />}>
                <Route path="FriendsLobby" element={<DirectConversation/>} />
                <Route path="Friend_List" element={<FindFriends />} />
                <Route path="Create Post" element={<CreatePost />} />
                <Route path="Notification" element={<NotificationTab />} />
              <Route path="Groups" element={<GroupChatMain />} />

              </Route>
              <Route path="/Profile/:id" element={<Profile />} />
              <Route path="*" element={<Home/>} /> 
          </Routes>
        </Router>
      </HomePageContextProvider>
    </ChatContextProvider>
  </SocialMediaContextProvider>
);
