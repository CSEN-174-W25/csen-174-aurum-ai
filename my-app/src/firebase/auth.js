import { auth } from "./firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export const runSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result;
};
