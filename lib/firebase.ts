// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAbIyuLwHSjOGhd6bMk_DdVxVqx7c2h2xs",
    authDomain: "hindustan-olympiad.firebaseapp.com",
    projectId: "hindustan-olympiad",
    storageBucket: "hindustan-olympiad.firebasestorage.app",
    messagingSenderId: "245793933298",
    appId: "1:245793933298:web:13d2fbe4e1df18fe764d6b"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier };