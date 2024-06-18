 
import ReactDOM from 'react-dom/client';
 
import React from 'react';
 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocialMediaContextProvider } from "./store/LogicStore"; // Correct import
import App from './App.jsx';
import GroupMessage from './components/GroupMessage.jsx';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import Auth from './components/Auth.jsx';
import { ChatContextProvider } from './store/ChatContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './components/Profile/Profile.jsx';
import Home from './components/Home Page/Home.jsx';
import CreatPost from './components/Home Page/CreatPost.jsx';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
 
    <SocialMediaContextProvider>  
    <ChatContextProvider>
      <Router>
        <Routes>
          {/* <Route path="/" element={<App />} /> */}
          <Route path="/" element={<Home/>} />
          <Route path="/FriendsLobby" element={<GroupMessage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<Auth />} />
          <Route path="/Profile" element={<Profile/>}/>
          <Route path="/Create Post" element={<CreatPost/>}/>
          {/* <Route path="/Auth" element={<Auth />} /> */}
        </Routes>
      </Router>
      </ChatContextProvider>
    </SocialMediaContextProvider>
 
);
