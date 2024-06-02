import React, { useContext, useEffect, useState } from 'react'
import "../styles/Login.css";
import { FaLock, FaUser } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { SocialMediaContext } from '../store/LogicStore';
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, provider } from '../store/firebaseConfig';
import Cookies from 'universal-cookie';
import { doc, setDoc } from 'firebase/firestore';
function Login() {

   const navigate = useNavigate();
   const cookies = new Cookies();
   const { currentUser} = useContext(SocialMediaContext);
 
   useEffect(() => {
      
      if(currentUser) navigate('/');
   },[])


   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState(null);  
 
   const handleLogin = async (e) => {
     e.preventDefault();
 
     try {
       const userCredential = await signInWithEmailAndPassword(auth, email, password);
       cookies.set("auth-token", userCredential.user.accessToken, {
         sameSite: "none",
         secure: true,
       });
  
       console.log('Login successful:', userCredential.user);
       navigate('/')
     } catch (error) {
       console.error('Login error:', error);
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
   } catch (error) {
     console.error("Authentication Error:", error);
   }
 };

 const ShowPass = () =>{
   const pass_field = document.querySelector(".pass-key");
   const showBtn = document.querySelector(".show");
   if(pass_field.type === "password"){
      pass_field.type = "text";
      showBtn.textContent = "HIDE"; 
      showBtn.style.color = "#3498db";
   }
   else{
      pass_field.type = "password";
      showBtn.textContent = "SHOW"; 
      showBtn.style.color = "#222";
   }
   
 }
   
  return (
   
    <div class="bg-img2">
     
    <div class="content">
       <header>Login Form</header>
       <form>
          <div class="field">
          <FaUser class="user"/>
             <input type="text"
             onChange={(e) => setEmail(e.target.value)}
             required placeholder="Email or Phone"/>
          </div>
          <div class="field space">
          <FaLock class="user"/>
             <input type="password" class="pass-key"
             onChange={(e) => setPassword(e.target.value)}
             required placeholder="Password"/>
             <span class="show" onClick={ShowPass}>SHOW</span>
          </div>
          <div class="pass">
             <a href="#">Forgot Password?</a>
          </div>
          <div class="field">
             <input type="button"
             onClick={(e) => handleLogin(e)}
             value="LOGIN"/>
          </div>
       </form>
       <div class="login">
          Or login with
       </div>
       <div class="links">
       
        <div class="instagram" onClick={signInWithGoogle}>
            <FcGoogle class="Google"/>
              <span>Google</span>
           
          </div>
       </div>
       <div class="signup">
          Don't have account?
          <NavLink to="/SignUp">Signup Now</NavLink>
        
       </div>
    </div>
 </div>
  )
}

export default Login;