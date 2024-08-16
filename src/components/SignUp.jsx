import React, { useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaUser } from "react-icons/fa";
import "../styles/SignUp.css";
import { FaLock } from "react-icons/fa6";

import { useNavigate, NavLink } from "react-router-dom";
function SignUp(props) {
  const {
    setEmail,
    setPassword,
    handleSignUp,
    email,
    password,
    signInWithGoogle,
    setDisplayName,
  } = props;

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
    <div className="bg-img">
      <div className="content">
        <header>SignUp Form</header>
        <form action="#">
          <div className="field">
            <FaUser className="user" />
            <input
              type="text"
              autoFocus
              required
              placeholder="Display Name"
              // value="text"
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="field space">
            <FaUser className="user" />
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field space">
            <FaLock className="user" />
            <input
              type="password"
              className="pass-key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            <span className="show" onClick={ShowPass}>
              SHOW
            </span>
          </div>
          {/* <div className="field space"  onClick={handleInputFile}>
                
          </div>
          <input
              type="file"
              ref={fileRef}
               
              style={{display :'none'}}
              onChange={(e) => setFile(e.target.files[0])}
            /> */}
          <div className="pass">
            <a href="#">Forgot Password?</a>
          </div>
          <div className="field">
            <input
              type="submit"
              value="SIGNUP"
              onClick={(e) => handleSignUp(e)}
            />
          </div>
        </form>
        <div className="login">Or SignUp with</div>
        <div className="links">
          <div className="instagram" onClick={signInWithGoogle}>
            <FcGoogle className="Google" />
            <span>Google</span>
          </div>
        </div>
        <nav>
          <div className="signup">
            if You have account?
            <NavLink to="/Login">Login Now</NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default SignUp;
