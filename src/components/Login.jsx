import React, { useContext, useEffect, useState } from "react";
import "../styles/Login.css";
import { FaLock, FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SocialMediaContext } from "../store/GeneralStore";
import { NavLink, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../store/firebaseConfig";
import Cookies from "universal-cookie";
import "../styles/common.css";
import { doc, setDoc } from "firebase/firestore";
import LoadingSpinner from "./General/LoadingSpinner";
import ToastNotification from "./Message/Notification";
function Login() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { currentUser } = useContext(SocialMediaContext);

  useEffect(() => {
    if (currentUser) navigate("/");
  }, []);
  const [showSpinner, setShowSpinner] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setShowSpinner(!showSpinner);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      cookies.set("auth-token", userCredential.user.accessToken, {
        sameSite: "none",
        secure: true,
      });

      "Login successful:", userCredential.user;
      setShowSpinner(!showSpinner);

      navigate("/");
    } catch (error) {
      setShowSpinner(false);

      setError(error.message);
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
    } catch (error) {}
  };
  const testLogin = (e) => {
    setEmail("abcde@gmail.com");
    setPassword("abcde@1234");
    handleLogin(e);
  };
  const ShowPass = () => {
    const pass_field = document.querySelector(".pass-key");
    const showBtn = document.querySelector(".show");
    if (pass_field.type === "password") {
      pass_field.type = "text";
      showBtn.textContent = "HIDE";
      showBtn.style.color = "#3498db";
    } else {
      pass_field.type = "password";
      showBtn.textContent = "SHOW";
      showBtn.style.color = "#222";
    }
  };

  return (
    <>
      {!showSpinner ? (
        <div className="bg-img2">
          <div className="content">
            <header>Login Form</header>
            <form>
              <div className="field">
                <FaUser className="user" />
                <input
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email or Phone"
                />
              </div>
              <div className="field space">
                <FaLock className="user" />
                <input
                  type="password"
                  className="pass-key"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
                <span className="show" onClick={ShowPass}>
                  SHOW
                </span>
              </div>
              <div className="pass">
                <a href="#">Forgot Password?</a>
              </div>
              <div className="field">
                <input
                  type="button"
                  onClick={(e) => handleLogin(e)}
                  value="LOGIN"
                />
              </div>
              <br />
              <div className="field1" onClick={(e) => testLogin(e)}>
                <p>TEST</p>
              </div>
            </form>
            <div className="login">Or login with</div>
            <div className="links">
              <div className="instagram" onClick={signInWithGoogle}>
                <FcGoogle className="Google" />
                <span>Google</span>
              </div>
            </div>
            <div className="signup">
              Don't have account?
              <NavLink to="/SignUp">Signup Now</NavLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="loadingSpinner">
          <LoadingSpinner />
        </div>
      )}
      {error && <ToastNotification notify={error} notificationType={"error"} />}
    </>
  );
}

export default Login;
