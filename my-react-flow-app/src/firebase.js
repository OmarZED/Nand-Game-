import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKfAu0oWoP55R6ZWg5kyUAkUDma97Km4Q",
  authDomain: "nand-game.firebaseapp.com",
  projectId: "nand-game",
  storageBucket: "nand-game.firebasestorage.app",
  messagingSenderId: "550742654249",
  appId: "1:550742654249:web:ba9a5cec585ad4802acb38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export auth functions
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export { auth };