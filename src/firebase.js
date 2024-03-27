import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCmo_ruCW85gR4UfyxC8BgRaPw09_L2Ais",
  authDomain: "vchat-app-dfcc1.firebaseapp.com",
  projectId: "vchat-app-dfcc1",
  storageBucket: "vchat-app-dfcc1.appspot.com",
  messagingSenderId: "506806123145",
  appId: "1:506806123145:web:65cdefd42bba0fee076458"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth= getAuth()
export const storage = getStorage();
export const db= getFirestore(app);