import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

const config = {
  apiKey: "AIzaSyCzA6FLzYXNcknSWERlWZdaRdRtqTNC8ig",
  authDomain: "khekheli-app.firebaseapp.com",
  projectId: "khekheli-app",
  storageBucket: "khekheli-app.appspot.com",
  messagingSenderId: "180670910875",
  appId: "1:180670910875:web:deaac7b8b9ea7dc75d113e",
};

const firebaseApp = !getApps().length ? initializeApp(config) : getApps()[0];

export const storage = getStorage(firebaseApp);
