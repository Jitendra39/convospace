import React, { useContext, useEffect, useState } from "react";
import "../styles/common.css";
import SignUp from "./SignUp";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { auth, db, provider, storage } from "../store/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { SocialMediaContext } from "../store/GeneralStore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import LoadingSpinner from "./General/LoadingSpinner";
import ToastNotification from "./Message/Notification";

const cookies = new Cookies();

function Auth() {
  const navigate = useNavigate();
  const { currentUser } = useContext(SocialMediaContext);

  useEffect(() => {
    if (currentUser) navigate("/");
  }, []);

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(!loading);

    if (displayName) {
      "displayName", displayName;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const date = new Date().getTime();

      try {
        //Update profile
        await updateProfile(userCredential.user, {
          displayName,
          // photoURL: downloadURL,
        });
        //create user on firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          displayName,
          email,
          // photoURL: downloadURL,
        });

        //create empty user chats on firestore
        await setDoc(doc(db, "userChats", userCredential.user.uid), {});
        navigate("/");
      } catch (err) {
        setLoading(false);
      }
      //   });
      // });

      cookies.set("auth-token", userCredential.user.accessToken, {
        sameSite: "none",
        secure: true,
      });

      navigate("/");
    } catch (error) {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.accessToken, {
        sameSite: "none",
        secure: true,
      });
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      });

      navigate("/");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div>
      {!loading ? (
        <SignUp
          setDisplayName={setDisplayName}
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          handleSignUp={handleSignUp}
          signInWithGoogle={signInWithGoogle}
          // setFile={setFile}
        />
      ) : (
        <div className="loadingSpinner">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}

export default Auth;
