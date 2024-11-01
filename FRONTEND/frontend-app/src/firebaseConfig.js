
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDVsDDDHIlNRxmLifk3msRfzcePV08lLQ8",
    authDomain: "emergency-qr-sys.firebaseapp.com",
    projectId: "emergency-qr-sys",
    storageBucket: "emergency-qr-sys.firebasestorage.app",
    messagingSenderId: "300409922474",
    appId: "1:300409922474:web:34a1ecb15240bb515181d3"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");

export { auth, googleProvider, facebookProvider, twitterProvider, microsoftProvider, signInWithPhoneNumber };
