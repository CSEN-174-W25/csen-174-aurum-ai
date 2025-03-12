import { auth } from "./firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getUserProfile, createUserProfile } from "./firestore";

export const runSignInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        
        // Check if user profile exists
        const { success, data } = await getUserProfile(result.user.uid);
        
        // If profile doesn't exist, create it
        if (!success) {
            const initialUserData = {
                personalInfo: {
                    email: result.user.email,
                    displayName: result.user.displayName,
                    createdAt: new Date().toISOString()
                },
                financialData: {
                    currentBalance: 0,
                    income: 0,
                    expenses: 0,
                    savings: 0
                },
                budgetCategories: [],
                financialGoals: [],
                investments: []
            };
            
            await createUserProfile(result.user.uid, initialUserData);
        }
        
        return result;
    } catch (error) {
        console.error("Error in Google Sign In:", error);
        throw error;
    }
};
