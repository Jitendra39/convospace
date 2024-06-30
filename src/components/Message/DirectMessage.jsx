import React, { useContext, useEffect, useRef, useState } from "react";
import "../../index.css";
import ConversationHeader from "../ConversationHeader";

import { RiMicLine } from "react-icons/ri";
import { BiMessageRoundedError, BiSend } from "react-icons/bi";
import waveformGif from "../../assets/waveform-10016798-8157897.gif";
import {
  Timestamp,
  arrayUnion,
  doc,
  query,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { SocialMediaContext } from "../../store/GeneralStore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { imgDB, storage, txtDB } from "../../store/firebaseConfig";
import { ChatContext } from "../../store/ChatContext";

import { onSnapshot } from "firebase/firestore";
import { db } from "../../store/firebaseConfig";

import ShareIcon from "@mui/icons-material/Share";
import CircularWithValueLabel from "./ProgressBar";
import AllMessages from "./AllMessages";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import Notification from "./Notification";
import NetworkConnection from "../NetworkConnection";
import Tooltip from "./Tooltip";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import PreviewMessages from "./PreviewMessages";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { useNavigate } from "react-router-dom";

const actions = [
  { icon: <VideoFileIcon />, name: "Video" },
  { icon: <SportsEsportsIcon />, name: "Game" },
  { icon: <PhotoLibraryIcon />, name: "Gallery" },
  { icon: <ShareIcon />, name: "Share" },
];

function DirectMessage() {
  const fileInputRef = useRef(null);
  const [ShowConversation, setShowConversation] = useState(true);
  const [Network, setNetwork] = useState(false);
  const [notify, setNotify] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [micSVG, setMicSVG] = useState(true);
  const [progressBar, setProgressBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playGame, setPlayGame] = useState("");
  const { currentUser, handleGameRequest, gameCheck, handleDeleteGameRequest } =
    useContext(SocialMediaContext);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const [emoji, setEmoji] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    setShowConversation(false);

    if (!data.chatId) {
      return;
    }

    const chatQuery = query(doc(db, "chats", data.chatId));

    const unsubscribe = onSnapshot(chatQuery, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const allMessages = docSnapshot.data().messages;
        setMessages(allMessages.slice(-10)); // Limit to last 10 messages
      }
    });

    return () => unsubscribe();
  }, [data.chatId]);

  const handleSend = async () => {
    if (!data.chatId) {
      return;
    }
    try {
      if (img) {
        setNetwork(!Network);
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",

          (snapshot) => {
            setProgress(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
          },

          (error) => {
            setNotificationType("error");
            setNotify(`Please check your internet connection and try again.`);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const chatId = data.chatId;

            try {
              await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text: text || "",
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                  type: img.type.includes("image") ? "image" : "video",
                }),
              });

              setProgressBar(false);
              setNotificationType("success");
              setNetwork(!Network);
              setNotify(`Photo sent successfully.`);
              setText("");
              setImg(null);
            } catch (error) {
              setNotificationType("error");
              setNotify(`Please check your internet connection and try again.`);
            }
          }
        );
      } else {
        const chatId = data.chatId;

        if (!text && !emoji) return;
        try {
          if (text && !emoji) {
            await updateDoc(doc(txtDB, "chats", chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                senderId: currentUser.uid,
                date: Timestamp.now(),
              }),
            });

            setText("");
          }
        } catch (error) {
          console.error("Error updating chat:", error);
        }
      }

      setText("");
      setImg(null);
    } catch (error) {
      console.error("Error in handleSend:", error);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.includes("image")) {
      const limit = 8000;
      const size = Math.round(file.size / 1024);

      if (size <= limit) {
        setImg(file);
        setProgressBar(true);
      }
    } else if (file && file.type.includes("video")) {
      const limit = 50000;
      const size = Math.round(file.size / 1024);

      if (size <= limit) {
        setImg(file);
        setProgressBar(true);
      }
    }
  };

  const handleInputFile = () => {
    fileInputRef.current.click();
  };

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

  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------Game Handler ----------------- -------------------------------------------------------------//
  const handleGameState = () => {
    handleGameRequest(data);
  };

  useEffect(() => {
    if (!data.user.uid) return;
    const fetchGameData = async () => {
      try {
        const gameData = await gameCheck(data.user);
        const gameData2 = await gameCheck(currentUser);

        if (gameData) {
          {
            gameData[data.user.uid]
              ? setPlayGame(gameData[data.user.uid])
              : setPlayGame(gameData[currentUser.uid]);
          }
        } else {
          {
            !gameData2[currentUser.uid]
              ? setPlayGame(gameData2[data.user.uid])
              : setPlayGame(gameData2[currentUser.uid]);
          }
        }
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchGameData();
  }, [data.user.uid, currentUser.uid]);

  async function deletePlayGameIcon() {
    let del = handleDeleteGameRequest(playGame.p1Uid, playGame.p2Uid);
    if(del) setPlayGame(!playGame);
  }

  function handlePlayGame() {
    navigate("/Games", { state: { playerDetails: playGame } });
  }

  return (
    <>
      {data.chatId === "null" && (
        <div className="conversation conversation-default active">
          <BiMessageRoundedError className="text-6xl" />
          <p>Select chat and view conversation!</p>
        </div>
      )}

      {data.chatId !== "null" && !ShowConversation && (
        <div class="conversation active">
          <ConversationHeader setShowConversation={setShowConversation} />

          <div class="conversation-main">
            <ul className="conversation-wrapper">
              {messages &&
                messages.map((message) => (
                  <AllMessages
                    key={message.id}
                    message={message}
                    currentUser={currentUser}
                    data={data}
                  />
                ))}
            </ul>

            {notify && (
              <Notification
                notify={notify}
                setNotify={setNotify}
                notificationType={notificationType}
                setNotificationType={setNotificationType}
              />
            )}
          </div>
          {playGame && (
            <PreviewMessages
              deletePlayGameIcon={deletePlayGameIcon}
              handlePlayGame={handlePlayGame}
            />
          )}
          <div class="conversation-form">
            <div className="conversation-form-box">
              {progressBar && <CircularWithValueLabel props={progress} />}
              {Network && <NetworkConnection />}

              {!progressBar && (
                <Tooltip
                  fileInputRef={fileInputRef}
                  handleFileInputChange={handleFileInputChange}
                  handleInputFile={handleInputFile}
                  open={open}
                  handleClose={handleClose}
                  handleOpen={handleOpen}
                  actions={actions}
                  handleGameState={handleGameState}
                />
              )}
            </div>
            <div class="conversation-form-group">
              <textarea
                class="conversation-form-input"
                rows="1"
                placeholder="Type here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>

              <button
                type="button"
                class="conversation-form-record"
                onClick={speechRecognition}
              >
                {micSVG ? (
                  <RiMicLine class="ri-mic-line" />
                ) : (
                  <img src={waveformGif} alt="mic" className="waveFormGif" />
                )}
              </button>
            </div>
            <button
              type="button"
              class="conversation-form-button conversation-form-submit"
              onClick={handleSend}
            >
              <BiSend class="ri-send-plane-2-line" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default DirectMessage;
