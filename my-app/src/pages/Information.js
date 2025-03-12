import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import {
  updateFinancialData,
  updateBudgetCategory,
  updateFinancialGoal,
  updateInvestment,
  addBudgetCategory as addFirestoreBudgetCategory,
  addFinancialGoal as addFirestoreGoal,
  addInvestment as addFirestoreInvestment,
  deleteArrayItem
} from '../firebase/firestore';
import './styles/Information.css';

const Information = ({ 
  financialData, setFinancialData,
  budgetCategories, setBudgetCategories,
  goals, setGoals,
  investments, setInvestments
}) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState('budget');
  const { currentUser } = useAuth();

  const handleFinancialChange = async (index, value) => {
    const updatedData = financialData.map((item, i) => 
      i === index ? { ...item, value: parseFloat(value) || 0 } : item
    );
    setFinancialData(updatedData);
    
    // Convert to Firestore format
    const firestoreData = {
      currentBalance: updatedData[0].value,
      income: updatedData[1].value,
      expenses: updatedData[2].value,
      savings: updatedData[3].value
    };
    
    await updateFinancialData(currentUser.uid, firestoreData);
  };

  const handleBudgetChange = async (index, field, value) => {
    const updatedBudget = [...budgetCategories];
    updatedBudget[index][field] = field === 'name' ? value : Number(value);
    setBudgetCategories(updatedBudget);
    
    await updateBudgetCategory(currentUser.uid, updatedBudget[index]);
  };

  const handleGoalChange = async (index, field, value) => {
    const updatedGoals = [...goals];
    updatedGoals[index][field] = field === 'name' ? value : Number(value);
    setGoals(updatedGoals);
    
    await updateFinancialGoal(currentUser.uid, updatedGoals[index]);
  };

  const handleInvestmentChange = async (index, field, value) => {
    const updatedInvestments = [...investments];
    
    if (field === 'percentage') {
      const newValue = Number(value);
      const currentTotal = investments.reduce((sum, inv, i) => 
        i !== index ? sum + inv.percentage : sum, 0);
      
      if (currentTotal + newValue > 100) {
        alert("Total investment percentage cannot exceed 100%");
        return;
      }
      updatedInvestments[index][field] = newValue;
    } else {
      updatedInvestments[index][field] = value;
    }
    
    setInvestments(updatedInvestments);
    await updateInvestment(currentUser.uid, updatedInvestments[index]);
  };

  const handleColorChange = async (index, category, value) => {
    const updatedItems = category === 'budget' 
      ? [...budgetCategories] 
      : category === 'goals' 
        ? [...goals] 
        : [...investments];
    
    updatedItems[index].color = value;
    
    if (category === 'budget') {
      setBudgetCategories(updatedItems);
      await updateBudgetCategory(currentUser.uid, updatedItems[index]);
    } else if (category === 'goals') {
      setGoals(updatedItems);
      await updateFinancialGoal(currentUser.uid, updatedItems[index]);
    } else {
      setInvestments(updatedItems);
      await updateInvestment(currentUser.uid, updatedItems[index]);
    }
  };

  const addBudgetCategory = async () => {
    const newCategory = {
      name: "New Category",
      spent: 0,
      budget: 0,
      color: "#" + Math.floor(Math.random()*16777215).toString(16)
    };
    
    const { success, data } = await addFirestoreBudgetCategory(currentUser.uid, newCategory);
    if (success) {
      setBudgetCategories([...budgetCategories, data]);
    }
  };

  const addGoal = async () => {
    const newGoal = {
      name: "New Goal",
      current: 0,
      target: 0,
      color: "#" + Math.floor(Math.random()*16777215).toString(16)
    };
    
    const { success, data } = await addFirestoreGoal(currentUser.uid, newGoal);
    if (success) {
      setGoals([...goals, data]);
    }
  };

  const addInvestment = async () => {
    const currentTotal = investments.reduce((sum, inv) => sum + inv.percentage, 0);
    if (currentTotal >= 100) {
      alert("Total investment percentage is already at 100%");
      return;
    }
    
    const newInvestment = {
      type: "New Investment",
      percentage: 0,
      color: "#" + Math.floor(Math.random()*16777215).toString(16)
    };
    
    const { success, data } = await addFirestoreInvestment(currentUser.uid, newInvestment);
    if (success) {
      setInvestments([...investments, data]);
    }
  };

  const removeItem = async (index, category) => {
    const items = category === 'budget' 
      ? budgetCategories 
      : category === 'goals' 
        ? goals 
        : investments;
    
    const itemId = items[index].id;
    const arrayName = category === 'budget' 
      ? 'budgetCategories' 
      : category === 'goals' 
        ? 'financialGoals' 
        : 'investments';

    const { success } = await deleteArrayItem(currentUser.uid, arrayName, itemId);
    
    if (success) {
      if (category === 'budget') {
        setBudgetCategories(budgetCategories.filter((_, i) => i !== index));
      } else if (category === 'goals') {
        setGoals(goals.filter((_, i) => i !== index));
      } else {
        setInvestments(investments.filter((_, i) => i !== index));
      }
    }
  };

  return (
    <div className="information-container">
      <h1>Financial Information</h1>
      
      <div className="tabs">
      <button 
          className={`tab ${activeCategoryTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveCategoryTab('financial')}
        >
          Financial Data
        </button>
        <button 
          className={`tab ${activeCategoryTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveCategoryTab('budget')}
        >
          Budget Categories
        </button>
        <button 
          className={`tab ${activeCategoryTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveCategoryTab('goals')}
        >
          Financial Goals
        </button>
        <button 
          className={`tab ${activeCategoryTab === 'investments' ? 'active' : ''}`}
          onClick={() => setActiveCategoryTab('investments')}
        >
          Investments
        </button>
      </div>
      
      <div className="tab-content">
        {/* Financial Data Tab */}
        {activeCategoryTab === 'financial' && (
          <div className="category-section">
            <h2>Financial Data</h2>
            <div className="items-container">
              {financialData.map((category, index) => (
                <div key={index} className="item-card">
                  <div className="item-inputs">
                    <div className="input-group">
                      <label>{category.name}:</label>
                      <input 
                        type="number" 
                        value={category.value}
                        onChange={(e) => handleFinancialChange(index, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Budget Categories Tab */}
        {activeCategoryTab === 'budget' && (
          <div className="category-section">
            <h2>Budget Categories</h2>
            <div className="items-container">
              {budgetCategories.map((category, index) => (
                <div key={index} className="item-card">
                  <div className="color-picker">
                    <input 
                      type="color" 
                      value={category.color}
                      onChange={(e) => handleColorChange(index, 'budget', e.target.value)}
                    />
                  </div>
                  <div className="item-inputs">
                    <div className="input-group">
                      <label>Category Name:</label>
                      <input 
                        type="text" 
                        value={category.name}
                        onChange={(e) => handleBudgetChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Budget Amount:</label>
                      <input 
                        type="number" 
                        value={category.budget}
                        onChange={(e) => handleBudgetChange(index, 'budget', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Amount Spent:</label>
                      <input 
                        type="number" 
                        value={category.spent}
                        onChange={(e) => handleBudgetChange(index, 'spent', e.target.value)}
                      />
                    </div>
                  </div>
                  <button 
                    className="remove-button"
                    onClick={() => removeItem(index, 'budget')}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button className="add-button" onClick={addBudgetCategory}>
              Add New Budget Category
            </button>
          </div>
        )}
        
        {/* Financial Goals Tab */}
        {activeCategoryTab === 'goals' && (
          <div className="category-section">
            <h2>Financial Goals</h2>
            <div className="items-container">
              {goals.map((goal, index) => (
                <div key={index} className="item-card">
                  <div className="color-picker">
                    <input 
                      type="color" 
                      value={goal.color}
                      onChange={(e) => handleColorChange(index, 'goals', e.target.value)}
                    />
                  </div>
                  <div className="item-inputs">
                    <div className="input-group">
                      <label>Goal Name:</label>
                      <input 
                        type="text" 
                        value={goal.name}
                        onChange={(e) => handleGoalChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Target Amount:</label>
                      <input 
                        type="number" 
                        value={goal.target}
                        onChange={(e) => handleGoalChange(index, 'target', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Current Amount:</label>
                      <input 
                        type="number" 
                        value={goal.current}
                        onChange={(e) => handleGoalChange(index, 'current', e.target.value)}
                      />
                    </div>
                  </div>
                  <button 
                    className="remove-button"
                    onClick={() => removeItem(index, 'goals')}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button className="add-button" onClick={addGoal}>
              Add New Financial Goal
            </button>
          </div>
        )}
        
        {/* Investments Tab */}
        {activeCategoryTab === 'investments' && (
          <div className="category-section">
            <h2>Investment Portfolio</h2>
            <div className="investment-total">
              Total Allocation: {investments.reduce((sum, inv) => sum + inv.percentage, 0)}%
            </div>
            <div className="items-container">
              {investments.map((investment, index) => (
                <div key={index} className="item-card">
                  <div className="color-picker">
                    <input 
                      type="color" 
                      value={investment.color}
                      onChange={(e) => handleColorChange(index, 'investments', e.target.value)}
                    />
                  </div>
                  <div className="item-inputs">
                    <div className="input-group">
                      <label>Investment Type:</label>
                      <input 
                        type="text" 
                        value={investment.type}
                        onChange={(e) => handleInvestmentChange(index, 'type', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Percentage (%):</label>
                      <input 
                        type="number" 
                        value={investment.percentage}
                        min="0"
                        max="100"
                        onChange={(e) => handleInvestmentChange(index, 'percentage', e.target.value)}
                      />
                    </div>
                  </div>
                  <button 
                    className="remove-button"
                    onClick={() => removeItem(index, 'investments')}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button className="add-button" onClick={addInvestment}>
              Add New Investment
            </button>
          </div>
        )}
      </div>
      
      <div className="action-buttons">
        <button className="save-button">Save Changes</button>
        <button className="reset-button">Reset</button>
      </div>
    </div>
  );
};

export default Information;