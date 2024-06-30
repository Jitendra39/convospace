import React, { useContext, useEffect, useRef, useState } from "react";
import "./Profile.css";
import { FaCopy } from "react-icons/fa";
import Sidebar from "../Sidebar";
import { SocialMediaContext } from "../../store/GeneralStore";
import ProfileEdit from "./ProfileEdit";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PostCard from "../Home Page/PostCard";
import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, realTimeDataBase } from "../../store/firebaseConfig";
import UserPost from "./UserPostCard";
import AlertDialog from "../General/AlertDialog";
import { set, ref, get, child, remove } from "firebase/database";
 

function Profile() {
  // const location = useLocation();
  // const  userInfo  = location.state?.userInfo || {};

  const navigate = useNavigate();
  const { id } = useParams();

  const [requestStatus, setRequestStatus] = useState("Add Friend");
  const [doneProfile, setDoneProfile] = useState(false);

  const [deletePost, setDeletePost] = useState(null);

  const [currentUser1, setCurrentUser] = useState("");
  const { currentUser,successAlert } = useContext(SocialMediaContext);
  const [userPosts, setUserPosts] = useState([]);
  const [postClicked, setPostClicked] = useState();
  const postClickedRef = useRef(null);
  // const {UnfollowRequest} = useContext(ChatContext)
  async function userData(id) {
    if (!currentUser.uid || currentUser.uid !== id) {
      const user = await getDoc(doc(db, "users", id));
      setCurrentUser(user.data());
    } else {
      setCurrentUser(currentUser);
    }
  }

  const getData = async () => {
    try {
      const valRef = collection(db, "PostData");
      const dataDb = await getDocs(valRef);
      const allData = dataDb.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const userPostsDocRef = doc(db, "user-posts", id);
      const userPostsDoc = await getDoc(userPostsDocRef);

      if (userPostsDoc.exists()) {
        const userPostIds = userPostsDoc.data().posts;

        const userPosts = allData.filter((post) =>
          userPostIds.includes(post.id)
        );

        setUserPosts(userPosts);
      } else {
        setUserPosts([]);
      }
    } catch (err) {
      setUserPosts([]);
    }
  };

  const handleClickOutSide = (event) => {
    if (
      postClickedRef.current &&
      !postClickedRef.current.contains(event.target)
    ) {
      setPostClicked(null);
    }
  };

  useEffect(() => {
    if (postClicked) {
      document.addEventListener("mousedown", handleClickOutSide);
    } else {
      document.removeEventListener("mousedown", handleClickOutSide);
    }

    return () => {
      document.addEventListener("mousedown", handleClickOutSide);
    };
  }, [postClicked]);

  const handleDeletePost = async () => {
    console.log(deletePost.id);
    if (!currentUser.uid || currentUser.uid !== id) return;

    try {
      const docRef = doc(db, "PostData", deletePost.id);
      const docRef2 = doc(db, "user-posts", currentUser.uid);

      await deleteDoc(docRef);

      await updateDoc(docRef2, {
        posts: arrayRemove(deletePost),
      });

      setDeletePost("");
      setPostClicked(null);
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const writeUserData = () => {
    // if(requestStatus === "Friends") navigate(`/User/${currentUser.displayName}/FriendsLobby`);

    if (id === currentUser.uid || requestStatus !== "Add Friend") return;

    const dataRef = ref(
      realTimeDataBase,
      `notification/${id}/${currentUser.uid}`
    );
    set(dataRef, {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
    })
      .then(() => {
        setRequestStatus("Pending");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async function fetchData() {
    const dbRef = ref(realTimeDataBase);
    try {
      const snapshot = await get(
        child(dbRef, `notification/${id}/${currentUser.uid}`)
      );
      if (snapshot.exists()) {
        setRequestStatus("Pending");
      } else {
        if (!id) {
          return;
        }
        const docRef = doc(db, "userChats", currentUser.uid);
        onSnapshot(docRef, (doc) => {
          const data = doc.data();
          // if(!data) setRequestStatus("Add Friend");
          const data1 = Object.entries(data).filter(
            ([id, chat]) => chat && chat.date
          );

          const data2 = data1.find(([key, chat]) => chat.userInfo.uid === id);
          if (data2) {
            setRequestStatus("UnFriend");
          } else {
            setRequestStatus("Add Friend");
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchData();
    userData(id);
    getData();
  }, [id]);

  const handleClickCopy = async () => {
    await navigator.clipboard.writeText(id);
  };

  return (
    <>
      {!doneProfile ? (
        <div className="row py-4 px-4  profile-main">
          <div className="col-xl-4 col-md-6 col-sm-10 mx-auto sub-profile-main">
            <div className="bg-white shadow rounded overflow-hidden">
              <div className="px-4 pt-0 pb-4 bg-dark">
                <div className="media align-items-end profile-header">
                  <div className="profile mr-3 Profile-Photo">
                    <img
                      src={
                        currentUser1.photoURL
                          ? currentUser1.photoURL
                          : "https://bootstrapious.com/i/snippets/sn-profile/teacher.jpg"
                      }
                      alt=".."
                      width="130"
                      className="rounded mb-/2 img-thumbnail"
                    />
                    {currentUser?.uid === id && (
                      <button
                        onClick={() => setDoneProfile(!doneProfile)}
                        className="btn btn-dark btn-sm btn-block"
                      >
                        Edit profile
                      </button>
                    )}
                  </div>
                  <div className="media-body mb-5 text-white profile-name">
                    <h4 className="mt-0 mb-0">{currentUser1.displayName}</h4>
                    <p
                      className="small mb-4 profile-locaton"
                      onClick={handleClickCopy}
                    >
                      {id}
                      <FaCopy className="profile-location-icon" />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-light p-4 d-flex justify-content-end text-center profile-item-list">
                <ul className="list-inline mb-0 ">
                  <li className="list-inline-item">
                    <h5 className="font-weight-bold mb-0 d-block">
                      {userPosts.length}
                    </h5>
                    <small className="text-muted">
                      <i className="fa fa-picture-o mr-1"></i>Posts
                    </small>
                  </li>
                  <li className="list-inline-item">
                    <h5 className="font-weight-bold mb-0 d-block">84K</h5>
                    <small className="text-muted">
                      <i className="fa fa-user-circle-o mr-1"></i>Friends
                    </small>
                  </li>
                </ul>
              </div>

              <div className="bg-light p-4 d-flex justify-content-end text-center profile-item-list">
                <div class="container">
                  <div class="btn" onClick={writeUserData}>
                    <a>
                      {/* {requestStatus} */}
                      {currentUser.uid === id ? "Friends" : `${requestStatus}`}
                    </a>
                  </div>
                  <div
                    class="btn"
                    onClick={() =>
                      navigate(`/User/${currentUser.displayName}/FriendsLobby`)
                    }
                  >
                    <a>Message</a>
                  </div>
                  <div class="btn" >
                    <a>Share</a>
                  </div>
                </div>
              </div>

              <div className="py-4 px-4 ">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="mb-0">POSTS</h5>
                  <a className="btn btn-link text-muted">Show all</a>
                </div>

                {userPosts[0] ? (
                  <div className="row post-list">
                    {userPosts.map((post) => (
                      <div
                        className="col-lg-6 mb-2 pr-lg-1"
                        key={post.id}
                        onClick={() => setPostClicked(post)}
                      >
                        {post.type && post.type.includes("image") ? (
                          <img
                            src={post.file}
                            alt="Post"
                            className="img-fluid rounded shadow-sm"
                          />
                        ) : (
                          <video
                            autoPlay
                            muted
                            className="img-fluid rounded shadow-sm"
                          >
                            <source src={post.file} type="video/mp4" />
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      color: "red",
                      width: "100%",
                      textAlign: "center",
                      border: "1px black solid",
                      padding: "20px",
                    }}
                  >
                    Posts Not Available
                  </div>
                )}
              </div>
            </div>
          </div>
          {postClicked && (
            <div className="UserPostCard">
              <div ref={postClickedRef} className="sub-UserPostCard">
                <UserPost
                  post={postClicked}
                  deletePost={setDeletePost}
                  id={id}
                />
              </div>
            </div>
          )}

          {deletePost && (
            <AlertDialog
              work={handleDeletePost}
              load={setDeletePost}
              message={deletePost.message}
            />
          )}
        </div>
      ) : (
        <ProfileEdit
          doneProfile={doneProfile}
          setDoneProfile={setDoneProfile}
        />
      )}

      <Sidebar />
    </>
  );
}

export default Profile;
