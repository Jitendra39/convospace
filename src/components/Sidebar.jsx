import React, { useContext, useEffect, useState } from "react";
import { TiHome } from "react-icons/ti";
import { MdGroups } from "react-icons/md";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import "../index.css";
import { signOut } from "firebase/auth";
import { auth } from "../store/firebaseConfig";
import Cookies from "universal-cookie";
import MailIcon from "@mui/icons-material/Mail";
import { TbLogout2 } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { MdOutlineAddBox } from "react-icons/md";
import { SocialMediaContext } from "../store/GeneralStore";
import CreatePost from "./Home Page/CreatePost";
import { Badge } from "@mui/material";
import NotificationTab from "./NotificationTab/NotificationTab";
const cookies = new Cookies();

function Sidebar() {
  const [createPost, setCreatepost] = useState(false);
  const { isLessThan768, currentUser, isLessThan999, fetchData } =
    useContext(SocialMediaContext);
  const [notificationCount, setNotificationCount] = useState("");
  const [notificationTab, setNotificationTab] = useState(false);
  const navigate = useNavigate();
  const [profileActive, setProfileActive] = useState(false);

  const ProfileDropdown = () => {
    setProfileActive(!profileActive);
  };

  const closeProfileDropdown = (e) => {
    if (!e.target.matches(".chat-sidebar-profile, .chat-sidebar-profile *")) {
      setProfileActive(false);
    }
  };

  const userSignOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    navigate("/SignUp");
  };

  useEffect(() => {
    if (!currentUser || !currentUser.displayName) {
      navigate("/SignUp");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", closeProfileDropdown);

    return () => {
      document.removeEventListener("click", closeProfileDropdown);
    };
  }, []);

  if (!currentUser) {
    return null;
  }
  useEffect(() => {
    const fetchNotificationCount = async () => {
      const count = await fetchData(currentUser);
      if (count) setNotificationCount(count.length);
    };
    fetchNotificationCount();
  }, []);

  return (
    <>
      <aside className="chat-sidebar">
        <div className="create-post-component1">
          {createPost && <CreatePost setCreatepost={setCreatepost} />}
        </div>
        <div className="create-post-component2">
          {notificationTab && (
            <NotificationTab
              setNotificationTab={setNotificationTab}
              notificationTab={notificationTab}
            />
          )}
        </div>
        <a href="#" className="chat-sidebar-logo">
          <i className="ri-chat-1-fill"></i>
        </a>
        <ul className="chat-sidebar-menu">
          <li>
            <NavLink to="/" activeclassname="active" data-title="Home">
              <TiHome className="ri-chat-3-line" />
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/User/${currentUser.displayName}/FriendsLobby`}
              activeclassname="active"
              data-title="Friends"
            >
              <BiSolidMessageRoundedDetail className="ri-folder-line" />
            </NavLink>
          </li>

          <li>
            {isLessThan768 ? (
              <NavLink
                to={`/User/${currentUser.displayName}/Create Post`}
                activeclassname="active"
                data-title="Create Post"
              >
                <MdOutlineAddBox className="ri-folder-line" />
              </NavLink>
            ) : (
              <NavLink activeclassname="active" data-title="Create Post">
                <MdOutlineAddBox
                  className="ri-folder-line"
                  onClick={() => {
                    setCreatepost(!createPost);
                  }}
                />
              </NavLink>
            )}
          </li>
          <li onClick={() => setNotificationTab(!notificationTab)}>
            <NavLink
              to={
                isLessThan768
                  ? `/User/${currentUser.displayName}/Notification`
                  : "/"
              }
              activeclassname="active"
              data-title="Available Soon...."
            >
              <Badge
                color="secondary"
                badgeContent={notificationCount ? notificationCount : 0}
              >
                <MailIcon sx={{ marginBottom: "20px" }} />
              </Badge>
            </NavLink>
          </li>
          {isLessThan999 && (
            <li>
              <NavLink
                to={`/User/${currentUser.displayName}/Friend_List`}
                activeclassname="active"
                data-title="Available Soon...."
              >
                <MdGroups className="ri-contacts-line" />
              </NavLink>
            </li>
          )}
          <li>
            <a data-title="Settings"></a>
          </li>

          <li
            className={`chat-sidebar-profile ${profileActive ? "active" : ""}`}
          >
            <button
              type="button"
              className="chat-sidebar-profile-toggle"
              onClick={ProfileDropdown}
            >
              <img
                src={currentUser && currentUser.photoURL}
                alt="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
              />
            </button>
            <ul className="chat-sidebar-profile-dropdown">
              <li>
                <NavLink to={`/Profile/${currentUser.uid}`}>
                  <CgProfile className="LogOutIcon"></CgProfile> Profile
                </NavLink>
              </li>
              <li onClick={userSignOut}>
                <NavLink to="/Login">
                  <TbLogout2 className="LogOutIcon"></TbLogout2> Logout
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </aside>
    </>
  );
}

export default Sidebar;
