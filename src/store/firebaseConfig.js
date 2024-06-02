// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getStorage } from "firebase/storage";
// import {getFirestore } from "firebase/firestore";
// import { browserLocalPersistence, getAuth, GoogleAuthProvider, setPersistence} from "firebase/auth";



// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDWNubtOLkM-oYGA6MvW2_XQ6wgtr0O32Q",
//   authDomain: "chat-app-f5d74.firebaseapp.com",
//   projectId: "chat-app-f5d74",
//   storageBucket: "chat-app-f5d74.appspot.com",
//   messagingSenderId: "659244704628",
//   appId: "1:659244704628:web:12e3725092f5b7def50221",
//   measurementId: "G-DZGHV5WZVW"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const storage = getStorage(app);

// export const imgDB = storage;

// export const db = getFirestore()
// const txtDB = db;

// export const auth = getAuth(app);
// await setPersistence(auth, browserLocalPersistence);
// export const provider = new GoogleAuthProvider();

// export {txtDB};




// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { browserLocalPersistence, getAuth, GoogleAuthProvider, setPersistence } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWNubtOLkM-oYGA6MvW2_XQ6wgtr0O32Q",
  authDomain: "chat-app-f5d74.firebaseapp.com",
  projectId: "chat-app-f5d74",
  storageBucket: "chat-app-f5d74.appspot.com",
  messagingSenderId: "659244704628",
  appId: "1:659244704628:web:12e3725092f5b7def50221",
  measurementId: "G-DZGHV5WZVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);

export const imgDB = storage;

export const db = getFirestore();
const txtDB = db;

export const auth = getAuth(app);

const initializeAuth = async () => {
  await setPersistence(auth, browserLocalPersistence);
};

initializeAuth().then(() => {
  console.log("Firebase authentication initialized with browserLocalPersistence");
}).catch((error) => {
  console.error("Error initializing Firebase authentication:", error);
});

export const provider = new GoogleAuthProvider();

export { txtDB };
