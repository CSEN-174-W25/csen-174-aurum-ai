import React, { useState, useEffect } from "react";
import ChatInterface from "../components/chatInterface";

const Chat = () => {
    const [userData, setUserData] = useState({});

    useEffect(() => {
        // Retrieve stored data from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user")) || { name: "Guest", lastLogin: "Unknown" };
        const storedBudgetCategories = JSON.parse(localStorage.getItem("budgetCategories")) || [];
        const storedGoals = JSON.parse(localStorage.getItem("goals")) || [];
        const storedInvestments = JSON.parse(localStorage.getItem("investments")) || [];
        const storedFinancialData = JSON.parse(localStorage.getItem("financialData")) || [];

        // Extract key financial values
        const userDataObject = {
            name: storedUser.name || "Guest",
            lastLogin: storedUser.lastLogin || "Unknown",
            currentDate: new Date().toLocaleDateString("en-US"),
            income: storedFinancialData.find(item => item.name === "Income")?.value || 0,
            expenses: storedFinancialData.find(item => item.name === "Expenses")?.value || 0,
            savings: storedGoals.find(goal => goal.name === "Emergency Fund")?.current || 0,
            investments: storedInvestments.reduce((acc, inv) => ({ ...acc, [inv.type]: inv.percentage }), {}),
            budgetCategories: storedBudgetCategories,
            goals: storedGoals,
        };

        setUserData(userDataObject);
    }, []);

    return <ChatInterface userData={userData} />;
};

export default Chat;