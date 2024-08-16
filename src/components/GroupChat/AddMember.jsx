import { Checkbox } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { handleSelectFriends } from "./GroupChatLogic";
import { ChatContext } from "../../store/ChatContext";

function AddMember({ userChats, groupName, searchResult, groups }) {
  const { dispatch } = useContext(ChatContext);
  const handleDispatch = (data) => {
    dispatch({ type: "GROUP_USER", payload: data });
  };
  const handleCheckFriends = (uid) => {
    const isExist = groups?.groups?.some((group) =>
      group.groupId?.members.some((member) => {
        return group.groupId.groupName === groupName && member.uid === uid;
      })
    );
    return isExist;
  };

  return (
    <div className="content-messages">
      <ul className="content-messages-list">
        {groupName && searchResult && (
          <li>
            <a data-conversation="#conversation-1">
              <img
                className="content-message-image"
                src={searchResult?.photoURL}
                alt="w3schools"
              />
              <span className="content-message-info">
                <span
                  className="content-message-name"
                  style={{ color: "white" }}
                >
                  {searchResult.displayName}
                </span>
                <span className="content-message-text">
                  Lorem ipsum dolor sit amet consectetur.
                </span>
              </span>
              <span className="content-message-more">
                <Checkbox
                  sx={{ color: "white" }}
                  onChange={() =>
                    handleSelectFriends(
                      searchResult.displayName,
                      searchResult.photoURL,
                      searchResult.uid
                    )
                  }
                />
              </span>
            </a>
          </li>
        )}
        {groupName ? (
          Object.entries(userChats)
            .filter(([id, chat]) => chat && chat.date)
            .sort((a, b) => b[1].date - a[1].date)
            .map((chat) => (
              <li key={chat[1].userInfo.uid}>
                <a data-conversation="#conversation-1">
                  <img
                    className="content-message-image"
                    src={chat[1].userInfo.photoURL}
                    alt="w3schools"
                  />
                  <span className="content-message-info">
                    <span
                      className="content-message-name"
                      style={{ color: "white" }}
                    >
                      {chat[1].userInfo.displayName}
                    </span>
                    <span className="content-message-text">
                      Lorem ipsum dolor sit amet consectetur.
                    </span>
                  </span>
                  <span className="content-message-more">
                    {!handleCheckFriends(chat[1].userInfo.uid) && (
                      <Checkbox
                        sx={{ color: "white" }}
                        onChange={() =>
                          handleSelectFriends(
                            chat[1].userInfo.displayName,
                            chat[1].userInfo.photoURL,
                            chat[1].userInfo.uid
                          )
                        }
                      />
                    )}
                  </span>
                </a>
              </li>
            ))
        ) : (
          <>
            {groups?.groups?.map((value, index) => (
              <li key={index} onClick={() => handleDispatch(value.groupId)}>
                <a data-conversation="#conversation-1">
                  <img
                    className="content-message-image"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Q7yovOSrpQlnoOKyCG-qZUFKbb7SN-FzDnN7SuxlI93KmX9XBpCLG1RTPrFrQdDWYFc&usqp=CAU"
                    alt="w3schools"
                  />
                  <span className="content-message-info">
                    <span
                      className="content-message-name"
                      style={{ color: "white" }}
                    >
                      {value?.groupId && value.groupId.groupName}
                    </span>
                    <span className="content-message-text">
                      {value.groupId?.members.map((member, index) => (
                        <React.Fragment key={index}>
                          {member.name},{" "}
                        </React.Fragment>
                      ))}
                    </span>
                  </span>
                  <span className="content-message-more"></span>
                </a>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
}

export default AddMember;

{
  /* <span className="content-message-unread">5</span>
     <span className="content-message-time">12:30</span> */
}
{
  /* <input type="checkbox" className={css.addMemberCheckBox} /> */
}
