import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { sendPasswordResetEmail, updatePassword, sendEmailVerification } from "firebase/auth";

export const runCreateUserWithEmailAndPassword = async (email, password) => {  
    return createUserWithEmailAndPassword(auth, email, password);
};

export const runSignInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const runSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    //result.user
    return result;
};

export const runSignOut = () => {
    return auth.signOut();
};

// export const runPasswordReset = (email) => {
//     return sendPasswordResetEmail(auth, email);
// };

// export const runPasswordChange = (password) => {
//     return updatePassword(auth.currentUser, password);
// }

// export const runSendEmailVerification = () => {
//     return sendEmailVerification(auth.currentUser, {
//         url: `${window.location.origin}/home`,
//     });
// }