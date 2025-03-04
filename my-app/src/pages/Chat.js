import React from "react";
import ChatInterface from "../components/chatInterface";

const Chat = ({ user, budgetCategories, goals, investments }) => {
    // Ensure user and other props have fallback values
    const safeUser = user || { name: "Guest", lastLogin: "Unknown" };
    const safeBudgetCategories = Array.isArray(budgetCategories) ? budgetCategories : [];
    const safeGoals = Array.isArray(goals) ? goals : [];
    const safeInvestments = Array.isArray(investments) ? investments : [];

    // Format financial data for AI
    const userData = {
        name: safeUser.name,
        lastLogin: safeUser.lastLogin,
        currentDate: new Date().toLocaleDateString("en-US"),
        income: safeBudgetCategories.reduce((acc, cat) => acc + cat.budget, 0),
        expenses: safeBudgetCategories.reduce((acc, cat) => acc + cat.spent, 0),
        savings: safeGoals.find(goal => goal.name === "Emergency Fund")?.current || 0,
        investments: safeInvestments.reduce((acc, inv) => ({ ...acc, [inv.type]: inv.percentage }), {}),
        budgetCategories: safeBudgetCategories,
        goals: safeGoals,
    };

    return <ChatInterface userData={userData} />;
};

export default Chat;