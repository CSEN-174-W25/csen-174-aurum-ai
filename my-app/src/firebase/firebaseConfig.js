// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC7gAukgeVBVbLiviogMWuMWOSmvpBkGn4",
    authDomain: "aurum-ai-7f81a.firebaseapp.com",
    projectId: "aurum-ai-7f81a",
    storageBucket: "aurum-ai-7f81a.firebasestorage.app",
    messagingSenderId: "983831462373",
    appId: "1:983831462373:web:6ead2092611611aee42f0c",
    measurementId: "G-6TX3NRN0CD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { analytics, auth };
