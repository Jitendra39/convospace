import { IoSearchOutline } from "react-icons/io5";
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import css from "../styles/Search.module.css";
import { MdDone } from "react-icons/md";
import Swal from "sweetalert2";

import AddMember from "./GroupChat/AddMember";
import { SocialMediaContext } from "../store/GeneralStore";
import { ChatContext } from "../store/ChatContext";
import {
  handleCreateGroup,
  handleGroupName,
  handleGetGroupsData,
} from "./GroupChat/GroupChatLogic";

function Search({
  setFetchRender,
  setAddMemberGpId,
  setLoadingSpinner,
  groupName,
  setGroupName,
  gpAdmin,
  AddMemberGpId,
  groups,
}) {
  const { handleSearchUser, currentUser } = useContext(SocialMediaContext);
  const { userChats } = useContext(ChatContext);
  const [URL, setURL] = useState();
  const [username, setUserName] = useState("");
  const URLS = useLocation();
  // const [groupName, setGroupName] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const handleSearch = async () => {
    const data = await handleSearchUser(username);
    setSearchResult(data);
  };

  useEffect(() => {
    if (URLS.pathname.includes("Groups")) {
      setURL(true);
    } else {
      setURL(false);
    }
  }, [URLS.pathname]);

  const handleCreateGp = () => {
    if (AddMemberGpId && gpAdmin !== currentUser.uid) {
      setGroupName("");
      return;
    }
    const addGpId = AddMemberGpId;
    handleCreateGroup(
      setFetchRender,
      groupName,
      setLoadingSpinner,
      setGroupName,
      currentUser,
      addGpId,
      setAddMemberGpId
    );
  };

  return (
    <>
      <div className="content-sidebar-title">
        <div>{URL ? (groupName ? "Select Members" : "Groups") : "Chats"}</div>

        {URL && (
          <div
            className={css.CreateGroup}
            onClick={() => {
              groupName ? searchResult : handleGroupName(setGroupName);
            }}
          >
            {groupName ? (
              <MdDone onClick={() => handleCreateGp()} />
            ) : (
              <AiOutlineUsergroupAdd />
            )}
          </div>
        )}
      </div>
      <div className="content-sidebar-form">
        <input
          type="text"
          onChange={(e) => {
            groupName && handleSearch(), setUserName(e.target.value);
          }}
          className="content-sidebar-input"
          placeholder="Search User"
        />
        <button
          type="button"
          className="content-sidebar-submit"
          onClick={handleSearch}
        >
          <IoSearchOutline className="ri-search-line" />
        </button>
      </div>

      {URL && (
        <AddMember
          groupName={groupName}
          userChats={userChats}
          searchResult={searchResult}
          groups={groups}
        />
      )}
    </>
  );
}

export default Search;
