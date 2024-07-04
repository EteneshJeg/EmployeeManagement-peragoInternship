import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAruKbilpaOGIlrlsH8_5kQtiu2SY5Ano0",
  authDomain: "intern-perago.firebaseapp.com",
  databaseURL: "https://intern-perago-default-rtdb.firebaseio.com",
  projectId: "intern-perago",
  storageBucket: "intern-perago.appspot.com",
  messagingSenderId: "476827984747",
  appId: "1:476827984747:web:7e4d27e42ca5c9e316622e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;