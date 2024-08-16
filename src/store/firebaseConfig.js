 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import {getMessaging, getToken} from "firebase/messaging";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWNubtOLkM-oYGA6MvW2_XQ6wgtr0O32Q",
  authDomain: "chat-app-f5d74.firebaseapp.com",
  projectId: "chat-app-f5d74",
  storageBucket: "chat-app-f5d74.appspot.com",
  messagingSenderId: "659244704628",
  appId: "1:659244704628:web:12e3725092f5b7def50221",
  measurementId: "G-DZGHV5WZVW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const realTimeDataBase = getDatabase(app)
export const storage = getStorage(app);

export const imgDB = storage;

export const db = getFirestore();
const txtDB = db;

export const auth = getAuth(app);

const initializeAuth = async () => {
  await setPersistence(auth, browserLocalPersistence);
};

// export const messaging = getMessaging(app)
// export const generateToken = async () =>{
//   const permission = await Notification.requestPermission();
//   console.log(permission)
//  if(permission === "granted")
//   {
//     const token = await getToken(messaging, {
//       vapidKey: "BLgPbm1Fo8Pav5slySA-WEWK5i7U6DVvBORAwwOzq_7qMbkoNpqxXJsbQao0TIGJmjYjRMbyo_HSETaSOMPsPXY"
//     })
//     console.log(token)
//   }


// }



initializeAuth()
  .then(() => {
    ("Firebase authentication initialized with browserLocalPersistence");
  })
  .catch((error) => {
      });

export const provider = new GoogleAuthProvider();

export { txtDB };
