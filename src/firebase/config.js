import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBesyV5IKoTpCO-0ymeBV9QqsYFgctHSzs",
    authDomain: "friendlychat-you-tube-short.firebaseapp.com",
    databaseURL: "https://friendlychat-you-tube-short.firebaseio.com",
    projectId: "friendlychat-you-tube-short",
    storageBucket: "friendlychat-you-tube-short.appspot.com",
    messagingSenderId: "411845781736",
    appId: "1:411845781736:web:10ef79fa60b229c954415d",
    measurementId: "G-52D6W1Z78W"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
