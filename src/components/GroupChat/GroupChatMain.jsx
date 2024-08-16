import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import css from "./GroupChatMain.module.css";
import GroupHeader from "./GroupHeader";
import Search from "../Search";
import { BiMessageRoundedError } from "react-icons/bi";
import AllMessages from "../Message/AllMessages";
import { SocialMediaContext } from "../../store/GeneralStore";
import InputMessage from "../General/InputMessage";
import LoadingSpinner from "../General/LoadingSpinner";
import "../../styles/common.css";
import { ChatContext } from "../../store/ChatContext";
import {
  handleSendMessage,
  socket,
  fetchMessage,
  handleGetGroupsData,
} from "./GroupChatLogic";
import { useLocation } from "react-router-dom";

function GroupChatMain() {
  const [fetchRender, setFetchRender] = useState(true);
  const [gpAdmin, setGpAdmin] = useState("");
  const [groupName, setGroupName] = useState("");
  const [AddMemberGpId, setAddMemberGpId] = useState("");
  const { data } = useContext(ChatContext);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [micSVG, setMicSVG] = useState(true);
  const [text, setText] = useState("");
  const { currentUser, isLessThan768 } = useContext(SocialMediaContext);
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState("");
  const URLS = useLocation();
  const speechRecognition = () => {
    let recognization = new webkitSpeechRecognition();
    recognization.onstart = () => {
      setMicSVG(!micSVG);
    };
    recognization.onresult = (e) => {
      var transcript = e.results[0][0].transcript;

      setText(transcript);
    };
    recognization.onend = () => {
      setMicSVG(true);
    };

    recognization.start();
  };

  function handleSend() {
    if (!text) {
      return;
    }

    handleSendMessage(text, data, currentUser.uid, currentUser.photoURL);
    setText("");
  }

  useEffect(() => {
    if (currentUser) {
      socket.on("newMessage", (messageData) => {
        setMessages((preData) => [...preData, messageData]);
        console.log("newMessage", messageData);
      });
    }
    return () => {
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    if (data.groupUser._id) {
      setMessages([]);
      setLoadingSpinner(true);
      fetchMessage(data.groupUser._id).then((data) => {
        if (data) {
          setMessages(data.message);
          setLoadingSpinner(false);
          setFetchRender(false);
        } else {
          setLoadingSpinner(false);
          setFetchRender(false);
        }
      });
      setLoadingSpinner(false);
      setFetchRender(false);
    }
  }, [data.groupUser, fetchRender]);

  const handleDeleteElementOfArray = (data) => {
    const index = messages.indexOf(data);
    if (index !== -1) {
      const newMessages = [...messages];
      newMessages.splice(index, 1);
      setMessages(newMessages);
    }
  };

  useEffect(() => {
    setFetchRender(false);
    const groupsget = async () => {
      setGroups();
      const data = await handleGetGroupsData(currentUser.uid);
      setGroups(data);
    };
    if (fetchRender) {
      setFetchRender(false);
      groupsget();
    }
  }, [fetchRender, currentUser.uid]);

  return (
    <>
      <div className={css.GroupMain}>
        <div className={css.gpSideBar}>
          <Sidebar />
        </div>
        <div
          className={`${
            data.groupUser._id
              ? isLessThan768
                ? `${css["hide"]}`
                : `${css["GroupList"]}`
              : `${css["GroupList"]}`
          }`}
        >
          <Search
            setFetchRender={setFetchRender}
            groups={groups}
            setAddMemberGpId={setAddMemberGpId}
            AddMemberGpId={AddMemberGpId}
            setLoadingSpinner={setLoadingSpinner}
            groupName={groupName}
            setGroupName={setGroupName}
            gpAdmin={gpAdmin}
          />
        </div>
        <div className={css.GroupContent}>
          {!data.groupUser._id && !isLessThan768 && (
            <div className="conversation conversation-default active">
              <BiMessageRoundedError className="text-6xl" />
              <p>Select chat and view conversation!</p>
            </div>
          )}
          {data.groupUser?._id && (
            <>
              <div className={css.GpConvo}>
                <div className={css.GroupHeader}>
                  <GroupHeader
                    setFetchRender={setFetchRender}
                    setGpAdmin={setGpAdmin}
                    setGroupName={setGroupName}
                    setAddMemberGpId={setAddMemberGpId}
                  />
                </div>
                <div className={css.AllGroupMessages}>
                  <ul className="conversation-wrapper">
                    {messages &&
                      messages?.map((message) => (
                        <AllMessages
                          key={message._id}
                          groupId={data.groupUser._id}
                          message={message}
                          currentUser={currentUser}
                          handleDeleteElementOfArray={
                            handleDeleteElementOfArray
                          }
                        />
                      ))}
                  </ul>
                </div>
                <div className={`${css.GroupInput}`}>
                  <div className="conversation-form">
                    <InputMessage
                      speechRecognition={speechRecognition}
                      micSVG={micSVG}
                      setText={setText}
                      text={text}
                      handleSend={handleSend}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {loadingSpinner && (
          <div className="loadingSpinner">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </>
  );
}

export default GroupChatMain;
