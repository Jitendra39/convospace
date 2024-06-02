import { IoSearchOutline } from "react-icons/io5";import React from 'react';

function Chat() {
  return (
    
     <>
        <div className="content-sidebar-title">Chats</div>
        <form action="#" className="content-sidebar-form">
          <input type="search" className="content-sidebar-input" placeholder="Search..." />
          <button type="submit" className="content-sidebar-submit"><IoSearchOutline className="ri-search-line"/></button>
        </form>
        <div className="content-messages">
          <ul className="content-messages-list">
            <li className="content-message-title"><span>Recently</span></li>
            <li>
              <a href="#" data-conversation="#conversation-1">
                <img className="content-message-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt="" />
                <span className="content-message-info">
                  <span className="content-message-name">Someone</span>
                  <span className="content-message-text">Lorem ipsum dolor sit amet consectetur.</span>
                </span>
                <span className="content-message-more">
                  <span className="content-message-unread">5</span>
                  <span className="content-message-time">12:30</span>
                </span>
              </a>
            </li>
            <li>
              <a href="#" data-conversation="#conversation-2">
                <img className="content-message-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt="" />
                <span className="content-message-info">
                  <span className="content-message-name">Someone</span>
                  <span className="content-message-text">Lorem ipsum dolor sit amet consectetur.</span>
                </span>
                <span className="content-message-more">
                  <span className="content-message-time">12:30</span>
                </span>
              </a>
            </li>
          </ul>
          <ul className="content-messages-list">
            <li className="content-message-title"><span>Recently</span></li>
            <li>
              <a href="#">
                <img className="content-message-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt="" />
                <span className="content-message-info">
                  <span className="content-message-name">Someone</span>
                  <span className="content-message-text">Lorem ipsum dolor sit amet consectetur.</span>
                </span>
                <span className="content-message-more">
                  <span className="content-message-unread">5</span>
                  <span className="content-message-time">12:30</span>
                </span>
              </a>
            </li>
            <li>
              <a href="#">
                <img className="content-message-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt="" />
                <span className="content-message-info">
                  <span className="content-message-name">Someone</span>
                  <span className="content-message-text">Lorem ipsum dolor sit amet consectetur.</span>
                </span>
                <span className="content-message-more">
                  <span className="content-message-time">12:30</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      
    </>
  );
}

export default Chat;
