// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAlPb5ZotWYStVpsF1D8_wTD7Ihmw6wFQ",
  authDomain: "meou-62873.firebaseapp.com",
  projectId: "meou-62873",
  storageBucket: "meou-62873.appspot.com",
  messagingSenderId: "309728518069",
  appId: "1:309728518069:web:2e79e991b6ae152c57c3fc",
  measurementId: "G-K5PKE2V19P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);
