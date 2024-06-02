import React, { useContext, useEffect, useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { auth, db, provider, storage } from "../store/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { SocialMediaContext } from "../store/LogicStore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const cookies = new Cookies();

function Auth() {



  const navigate = useNavigate();
  const { currentUser} = useContext(SocialMediaContext);
 
  useEffect(() => {
     
     if(currentUser) navigate('/');
  },[])


  const [loading, setLoading] = useState(false);
   
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("")
  // const [file, setFile] = useState("")
  const [err, setErr] = useState(false);
  const handleSignUp = async (e) => {
    e.preventDefault();

    if(displayName){
      console.log("displayName", displayName)
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const date = new Date().getTime();
      const storageRef =ref(storage, `${displayName + date}`)
 

      
      // await uploadBytesResumable(storageRef, file).then(() => {
      //   getDownloadURL(storageRef).then(async (downloadURL) => {
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
            console.log(err);
            setErr(true);
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
      console.error("Signup Error:", error);
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
      console.error("Authentication Error:", error);
    }
  };


  return (
    
    <div>
      <SignUp
      err={err}
      loading={loading}
        setDisplayName={setDisplayName}
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        handleSignUp={handleSignUp}
        signInWithGoogle={signInWithGoogle}
        // setFile={setFile}
      />
    </div>
  );
}

export default Auth;
