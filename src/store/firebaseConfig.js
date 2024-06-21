 
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

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "XXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "XXXXXXXXXXXXXXXXXXXXXXXXX",
  projectId: "XXXXXXXXXXXXXXXXX",
  storageBucket:  "XXXXXXXXXXXXXXXXX",
  messagingSenderId:  "XXXXXXXXXXXXXXXXX",
  appId: "XXXXXXXXXXXXXXXXXXXXXXXXX",
  measurementId:  "XXXXXXXXXXXXXXXXXXXXXXXXX",
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
    console.error("Error initializing Firebase authentication:", error);
  });

export const provider = new GoogleAuthProvider();

export { txtDB };
