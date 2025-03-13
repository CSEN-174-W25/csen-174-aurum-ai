import React, { useState, useEffect } from "react";
import { getUserProfile } from '../firebase/firestore';
import ChatInterface from "../components/chatInterface";
import { useAuth } from "../contexts/authContext";
import { getAuth } from "firebase/auth";

const Chat = () => {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);

    const currentUser = useAuth();
    const auth = getAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { success, data } = await getUserProfile(auth.currentUser.uid);
                
                if (success && data) {
                    const userDataObject = {
                        uid: auth.currentUser.uid,
                        name: data.personalInfo?.name || "Guest",
                        lastLogin: data.personalInfo?.lastLogin || "Unknown",
                        currentDate: new Date().toLocaleDateString("en-US"),
                        income: data.financialData?.income || 0,
                        expenses: data.financialData?.expenses || 0,
                        savings: data.financialData?.savings || 0,
                        investments: data.investments?.reduce((acc, inv) => ({
                            ...acc,
                            [inv.type]: inv.percentage
                        }), {}),
                        budgetCategories: data.budgetCategories?.map(cat => ({
                            name: cat.name,
                            spent: cat.amountSpent,
                            budget: cat.budgetAmount
                        })) || [],
                        goals: data.financialGoals?.map(goal => ({
                            name: goal.name,
                            current: goal.currentAmount,
                            target: goal.targetAmount
                        })) || []
                    };

                    setUserData(userDataObject);
                } else {
                    console.error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser, auth.currentUser?.uid]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return <ChatInterface userData={userData} />;
};

export default Chat;