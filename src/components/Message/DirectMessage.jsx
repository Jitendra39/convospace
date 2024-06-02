import React, { useContext, useEffect, useRef, useState } from "react";
import "../../index.css";
import ConversationHeader from "../ConversationHeader";
 
import { RiMicLine } from "react-icons/ri";
import { FaRegFaceSmileWink } from "react-icons/fa6";
import { BiMessageRoundedError, BiSend } from "react-icons/bi";
import waveformGif from '../../assets/waveform-10016798-8157897.gif';
import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  limit,
  limitToLast,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { SocialMediaContext } from "../../store/LogicStore";
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

 
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
 
import ShareIcon from "@mui/icons-material/Share";
import CircularWithValueLabel from "./ProgressBar";
import SendedMessages from "./AllMessages";
import AllMessages from "./AllMessages";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import Notification from "./Notification";
import NetworkConnection from "../NetworkConnection";
import Tooltip from "./Tooltip";
import VideoFileIcon from '@mui/icons-material/VideoFile';
import PreviewMessages from "./PreviewMessages";
import EmojiPicker from "./EmojiPicker";
 
const actions = [
  { icon: <VideoFileIcon/>, name: "Video" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PhotoLibraryIcon />, name: "Gallery" },
  { icon: <ShareIcon />, name: "Share" },
];

function DirectMessage() {
  const fileInputRef = useRef(null);
  const [ShowConversation, setShowConversation] = useState(true)
  const [Network, setNetwork] = useState(false);
  const [notify, setNotify] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [micSVG, setMicSVG] = useState(true)
  const [progressBar, setProgressBar] = useState(false);
  const [progress, setProgress] = useState(0);

  const { currentUser } = useContext(SocialMediaContext);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const [emoji, setEmoji] = useState(null);

 
  useEffect(() => {
    setShowConversation(false);

    if (!data.chatId) {
      return;
    }

    const chatQuery = query(
      doc(db, "chats", data.chatId)
    );

    const unsubscribe = onSnapshot(chatQuery, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const allMessages = docSnapshot.data().messages;
        setMessages(allMessages.slice(-40)); // Limit to last 10 messages
      }
    });

    return () => unsubscribe();
  }, [data.chatId]);
  

  

  const handleSend = async () => {
  console.log("sender id ",data.chatId)
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
            console.log(
              "Upload is " +
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100 +
                "% done"
            );
          },

          (error) => {
            setNotificationType("error");
            setNotify(`Please check your internet connection and try again.`);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", downloadURL);
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
          if(text && !emoji){
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

          console.log("display name =", data.user.displayName);
          await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
              text,
            },
            [data.chatId + ".userInfo"]:{
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              uid: currentUser.uid,
            },
            [data.chatId + ".date"]: serverTimestamp(),
          });

          setText("");
        }else{
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
              img: emoji,
              type: "image",
            }),
          })
          setText("");
          setEmoji(null);
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
    }else if(file && file.type.includes("video")){
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
    }
    recognization.onresult = (e) => {
      var transcript = e.results[0][0].transcript;
      
      setText(transcript);
   }
   recognization.onend = () => {
    setMicSVG(true);  
  }
   
   recognization.start();
  }

  return (
    <>

{console.log("message ==",messages)}
      {data.chatId === "null" &&  (
        <div className="conversation conversation-default active">
          <BiMessageRoundedError className="text-6xl" />
          <p>Select chat and view conversation!</p>
        </div>
      )}
 
      {data.chatId !== "null" && !ShowConversation && (
      
        <div class="conversation active">
          <ConversationHeader setShowConversation={setShowConversation}/>
{/*          
          <hr
            style={{
              borderColor: "black",
              backgroundColor: "black",
              margin: "0rem",
            }}
          /> */}

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
         {emoji && !showEmojiPicker && <PreviewMessages emoji={emoji}  setEmoji={setEmoji}/>}
         {showEmojiPicker && <EmojiPicker setEmoji={setEmoji}
             setShowEmojiPicker={setShowEmojiPicker}
         />}

          {notify && <Notification notify={notify} 
          setNotify={setNotify}
          notificationType={notificationType}
          setNotificationType={setNotificationType}
          />}
          </div>
          {/* <hr
            style={{
              borderColor: "black",
              backgroundColor: "black",
              color: "black",
              margin: "0rem",
            }}
          /> */}

          <div class="conversation-form">
            <div className="conversation-form-box">
              {progressBar && <CircularWithValueLabel props={progress} /> }
              {Network &&  <NetworkConnection/> }
            
              {!progressBar && (
               <Tooltip  fileInputRef={fileInputRef}
                          handleFileInputChange={handleFileInputChange}
                          handleInputFile={handleInputFile}
                          open={open}
                          handleClose={handleClose}
                          handleOpen={handleOpen}
                          actions={actions}
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

              <button type="button" class="conversation-form-record" onClick={speechRecognition}>
             { micSVG ?  ( <RiMicLine class="ri-mic-line" /> ):(
                             <img src={waveformGif} alt="mic" className="waveFormGif"/> )
            }
              </button>

              <button type="button" class="conversation-form-record-2"   onClick={() => {setShowEmojiPicker(!showEmojiPicker)}}>
                <FaRegFaceSmileWink class="ri-emotion-line" />
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
