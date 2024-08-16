import React, { useContext, useState } from "react";
import css from "./GroupHeader.module.css";
import Menu from "./HeaderMenu";
import { ChatContext } from "../../store/ChatContext";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { ExitGroup } from "./GroupChatLogic";
import { SocialMediaContext } from "../../store/GeneralStore";
import AlertDialog from "../General/AlertDialog";
function GroupHeader({
  setGroupName,
  setAddMemberGpId,
  setGpAdmin,
  setFetchRender,
}) {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(SocialMediaContext);
  const { dispatch } = useContext(ChatContext);
  const [exit, setExit] = useState("");
  let gpName = data.groupUser.groupName;
  let gpId = data.groupUser._id;

  const handleDispatch = () => {
    dispatch({ type: "GROUP_USER", payload: "" });
  };
  const AddMember = () => {
    setGroupName(data.groupUser.groupName);
    setAddMemberGpId(data.groupUser._id);
    setGpAdmin(data.groupUser.admin);
    handleDispatch();
  };

  const handleExit = () => {
    ExitGroup(gpName, gpId, currentUser.uid);
    handleDispatch();
    setFetchRender(true);
  };
  return (
    <>
      <div className={css.mainHeader}>
        <div className={css.gpHeaderBackIcon}>
          {
            <IoChevronBackCircleOutline
              onClick={() => {
                handleDispatch();
              }}
            />
          }
        </div>
        <div className={css.groupName}>{data.groupUser.groupName}</div>
        <div className={css.MenuIcon}>
          <Menu AddMember={AddMember} setExit={setExit} />
        </div>
      </div>
      {exit && (
        <AlertDialog
          work={handleExit}
          load={setExit}
          message={"Are you sure you want to exit the group?"}
        />
      )}
    </>
  );
}

export default GroupHeader;
