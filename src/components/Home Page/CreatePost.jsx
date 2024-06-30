import React, { useContext, useEffect, useRef, useState } from "react";
import "./CreatePost.css";
import { FaPhotoVideo } from "react-icons/fa";
import ListItem from "@mui/material/ListItem";
import CancelIcon from "@mui/icons-material/Cancel";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Sidebar from "../Sidebar";
import { v4 as uuid } from "uuid";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { SocialMediaContext } from "../../store/GeneralStore";
import { db, storage } from "../../store/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";

function CreatePost({ setCreatepost }) {
  const { currentUser, dispatch } = useContext(SocialMediaContext);
  const navigation = useNavigate();
  const postFileRef = useRef(null);
  const [tempPost, setTempPost] = useState(null);
  const [postFile, setPostFile] = useState(null);
  const [postDescription, setPostDescription] = useState("");

  const handleInputClick = () => {
    postFileRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.includes("image")) {
      setPostFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPost(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file.type.includes("video")) {
      setPostFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPost(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!postFile) {
      return;
    }
    try {
      const res = await getDoc(doc(db, "user-posts", currentUser.uid));
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, postFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          dispatch({
            type: "PROGRESS",
            payload: {
              progress: progress,
            },
          });
        },
        (error) => {
          dispatch({
            type: "NOTIFY",
            payload: {
              notify: "Please check your internet connection.",
              notificationType: "err",
            },
          });
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const randomId = uuid();

          setDoc(doc(db, "PostData", randomId), {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            serverTimestamp: serverTimestamp(),
            userLikes: [],
            userDislikes: [],
            description: postDescription || " ",
            file: downloadURL,
            likes: 0,
            type: postFile.type,
            dislikes: 0,
          });

          if (!res.exists()) {
            setDoc(doc(db, "user-posts", currentUser.uid), {
              posts: [randomId],
            });
          } else {
            updateDoc(doc(db, "user-posts", currentUser.uid), {
              posts: [...res.data().posts, randomId],
            });
          }

          ///dispatching notification
          {
            downloadURL &&
              dispatch({
                type: "NOTIFY",
                payload: {
                  notify: "Post Created Successfully",
                  notificationType: "success",
                },
              });
          }
        }
      );
    } catch (err) {
      dispatch({
        type: "NOTIFY",
        payload: {
          notify: "Please check your internet connection.",
          notificationType: "err",
        },
      });
    }
    setTempPost(null);
    setPostFile(null);
    setPostDescription("");

    {
      setCreatepost && setCreatepost(false);
    }
    navigation("/");
  };

  return (
    <>
      <div className="sideBar-Visible">
        <Sidebar />
      </div>
      <div className="create-post-main">
        <div className="create-post">
          <div className="create-post-page-title">Create Post</div>
          <hr style={{ padding: "0", margin: "0" }} />
          <div className="create-post-user-name">
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Cindy Baker" src={currentUser.photoURL} />
              </ListItemAvatar>
              <ListItemText
                primary={currentUser.displayName}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Indian
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          </div>
          {!tempPost ? (
            <>
              <div className="input-file-box" onClick={handleInputClick}>
                <div className="photo-video-icon">
                  <FaPhotoVideo />
                </div>
                <div className="photo-video-title">Add photos/videos</div>
              </div>
            </>
          ) : (
            <div className="input-file-box-preview" onClick={handleInputClick}>
              <CancelIcon
                className="photo-video-cancel"
                onClick={() => {
                  setPostFile(null), setTempPost(null);
                }}
              />
              {tempPost.includes("image") ? (
                <img src={tempPost} alt="post" />
              ) : (
                <video
                  width="300"
                  height="200"
                  style={{ maxHeight: "300px" }}
                  controls
                >
                  <source src={tempPost} type="video/mp4" />
                </video>
              )}
            </div>
          )}

          <div className="photo-video-descreption">
            <textarea
              placeholder="Write your description..."
              onChange={(e) => {
                setPostDescription(e.target.value);
              }}
            ></textarea>
          </div>

          <div
            className={
              postDescription || postFile ? "post-btn-exist" : "post-btn"
            }
            onClick={handleCreatePost}
          >
            <button>Post</button>
          </div>
          <CancelIcon
            className="photo-video-cancel-1"
            onClick={() => {
              setCreatepost(false);
            }}
          />
        </div>
      </div>

      <input
        type="file"
        ref={postFileRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}

export default CreatePost;
