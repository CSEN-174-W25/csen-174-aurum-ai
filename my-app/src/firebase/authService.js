import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken(); // Get Firebase ID Token
        console.log("User logged in:", userCredential.user);
        return token;
    } catch (error) {
        console.error("Login failed:", error);
        return null;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
        console.log("User logged out");
    } catch (error) {
        console.error("Logout failed:", error);
    }
};
