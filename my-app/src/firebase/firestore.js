import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';

// User profile and financial data structure

/*
users/{userId}/
    - personalInfo: {}
    - financialData: {
        currentBalance: number,
        income: number,
        expenses: number,
        savings: number
    }
    - budgetCategories: [
        {
        id: string,
        name: string,
        budgetAmount: number,
        amountSpent: number
        }
    ]
    - financialGoals: [
        {
        id: string,
        name: string,
        targetAmount: number,
        currentAmount: number
        }
    ]
    - investments: [
        {
        id: string,
        type: string,
        percentage: number
        }
    ]
*/

// Create or update user profile
export const createUserProfile = async (userId, userData) => {
    try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, userData, { merge: true });
    return { success: true };
    } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error };
    }
};

// Get user profile
export const getUserProfile = async (userId) => {
    try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
        return { success: true, data: userSnap.data() };
    } else {
        return { success: false, error: 'User not found' };
    }
    } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error };
    }
};

// Update financial data
export const updateFinancialData = async (userId, financialData) => {
    try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { financialData });
    return { success: true };
    } catch (error) {
    console.error('Error updating financial data:', error);
    return { success: false, error };
    }
};

// Add budget category
export const addBudgetCategory = async (userId, category) => {
    try {
    const userRef = doc(db, 'users', userId);
    const categoryWithId = {
        ...category,
        id: Date.now().toString() // Simple ID generation
    };
    
    await updateDoc(userRef, {
        budgetCategories: arrayUnion(categoryWithId)
    });
    
    return { success: true, data: categoryWithId };
    } catch (error) {
    console.error('Error adding budget category:', error);
    return { success: false, error };
    }
};

// Update budget category
export const updateBudgetCategory = async (userId, updatedCategory) => {
    try {
    // Get current categories
    const { data } = await getUserProfile(userId);
    const categories = data.budgetCategories || [];
    
    // Replace the category with the updated one
    const updatedCategories = categories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
    );
    
    // Update in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { budgetCategories: updatedCategories });
    
    return { success: true };
    } catch (error) {
    console.error('Error updating budget category:', error);
    return { success: false, error };
    }
};

// Add financial goal
export const addFinancialGoal = async (userId, goal) => {
    try {
    const userRef = doc(db, 'users', userId);
    const goalWithId = {
        ...goal,
        id: Date.now().toString()
    };
    
    await updateDoc(userRef, {
        financialGoals: arrayUnion(goalWithId)
    });
    
    return { success: true, data: goalWithId };
    } catch (error) {
    console.error('Error adding financial goal:', error);
    return { success: false, error };
    }
};

// Update financial goal
export const updateFinancialGoal = async (userId, updatedGoal) => {
    try {
    // Get current goals
    const { data } = await getUserProfile(userId);
    const goals = data.financialGoals || [];
    
    // Replace the goal with the updated one
    const updatedGoals = goals.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
    );
    
    // Update in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { financialGoals: updatedGoals });
    
    return { success: true };
    } catch (error) {
    console.error('Error updating financial goal:', error);
    return { success: false, error };
    }
};

// Add investment
export const addInvestment = async (userId, investment) => {
    try {
    const userRef = doc(db, 'users', userId);
    const investmentWithId = {
        ...investment,
        id: Date.now().toString()
    };
    
    await updateDoc(userRef, {
        investments: arrayUnion(investmentWithId)
    });
    
    return { success: true, data: investmentWithId };
    } catch (error) {
    console.error('Error adding investment:', error);
    return { success: false, error };
    }
};

// Update investment
export const updateInvestment = async (userId, updatedInvestment) => {
    try {
    // Get current investments
    const { data } = await getUserProfile(userId);
    const investments = data.investments || [];
    
    // Replace the investment with the updated one
    const updatedInvestments = investments.map(inv => 
        inv.id === updatedInvestment.id ? updatedInvestment : inv
    );
    
    // Update in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { investments: updatedInvestments });
    
    return { success: true };
    } catch (error) {
    console.error('Error updating investment:', error);
    return { success: false, error };
    }
};

// Delete item from an array (can be used for budget categories, goals, or investments)
export const deleteArrayItem = async (userId, arrayName, itemId) => {
    try {
    // Get current items
    const { data } = await getUserProfile(userId);
    const items = data[arrayName] || [];
    
    // Filter out the item to delete
    const updatedItems = items.filter(item => item.id !== itemId);
    
    // Update in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { [arrayName]: updatedItems });
    
    return { success: true };
    } catch (error) {
    console.error(`Error deleting item from ${arrayName}:`, error);
    return { success: false, error };
    }
};