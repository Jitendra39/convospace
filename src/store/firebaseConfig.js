 
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
  ////
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





initializeAuth()
  .then(() => {
    ("Firebase authentication initialized with browserLocalPersistence");
  })
  .catch((error) => {
      });

export const provider = new GoogleAuthProvider();

export { txtDB };
