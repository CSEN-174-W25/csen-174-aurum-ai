import React, { useEffect, useState, useContext } from "react";
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { createUserProfile, getUserProfile } from "../firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch user data from Firestore
    async function fetchUserData(userId) {
        const { success, data } = await getUserProfile(userId);
        if (success) {
            setUserData(data);
        }
        return { success, data };
    }

    useEffect(() => {
        const initializeUser = async (user) => {
            if (user) {
                setCurrentUser({ ...user });
                setUserLoggedIn(true);
                await fetchUserData(user.uid);
            } else {
                setCurrentUser(null);
                setUserData(null);
                setUserLoggedIn(false);
            }
            setLoading(false);
        };

        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe; 
    }, []);

    // Authentication functions
    async function signup(email, password, profileData) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const initialUserData = {
                personalInfo: {
                    email,
                    createdAt: new Date().toISOString(),
                    ...profileData
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
            await createUserProfile(userCredential.user.uid, initialUserData);
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    const value = {
        currentUser,
        userData,
        userLoggedIn,
        signup,
        login,
        logout,
        fetchUserData
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}