import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../store/ChatContext";
import { MdPhone } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { SocialMediaContext } from "../store/GeneralStore";
import AlertDialog from "./General/AlertDialog";
function ConversationHeader({ setShowConversation }) {
  const navigate = useNavigate();
  const { data, UnfollowRequest } = useContext(ChatContext);
  const { currentUser } = useContext(SocialMediaContext);
  const [alert, setAlert] = useState("");
  useEffect(() => {
    {
      "data=", data.user;
    }
  }, [data]);

  const handleDelete = async () => {
    setAlert("");
    UnfollowRequest(data.user.uid);
  };

  return (
    <>
      {alert && (
        <AlertDialog work={handleDelete} load={setAlert} message={alert} />
      )}
      <div class="conversation-top">
        <button
          type="button"
          class="conversation-back"
          onClick={() => {
            setShowConversation(true);
          }}
        >
          <IoArrowBackCircleOutline style={{ fontSize: "2rem" }} />
        </button>
        <div class="conversation-user">
          <img
            class="conversation-user-image"
            src={data.user.photoURL}
            alt=""
          />
          <div>
            <div class="conversation-user-name">{data.user.displayName}</div>
            {/* <div class="conversation-user-status online">online</div> */}
          </div>
        </div>
        <div class="conversation-buttons">
          <button type="button">
            <MdPhone className="conversation-buttons-name" />
          </button>
          <button type="button">
            <IoVideocamOutline className="conversation-buttons-name" />
          </button>
          <button type="button">
            <MdDeleteForever
              className="conversation-buttons-name"
              onClick={() =>
                setAlert(
                  "Are you sure you want to unfriend this person? This action will also delete all messages."
                )
              }
            />
          </button>
        </div>
      </div>
    </>
  );
}

export default ConversationHeader;
