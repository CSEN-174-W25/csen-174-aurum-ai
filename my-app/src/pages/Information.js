import React, { useState } from 'react';
import './styles/Information.css';

const Information = ({ 
  financialData, setFinancialData,
  budgetCategories, setBudgetCategories,
  goals, setGoals,
  investments, setInvestments
}) => {
  // Create state for form data
  const [activeCategoryTab, setActiveCategoryTab] = useState('budget');

  const handleFinancialChange = (index, value) => {
    const updatedData = financialData.map((item, i) => 
        i === index ? { ...item, value: parseFloat(value) || 0 } : item
    );
    setFinancialData(updatedData);
    localStorage.setItem("financialData", JSON.stringify(updatedData));
};

const handleBudgetChange = (index, field, value) => {
    const updatedBudget = [...budgetCategories];
    updatedBudget[index][field] = field === 'name' ? value : Number(value);
    setBudgetCategories(updatedBudget);
    localStorage.setItem("budgetCategories", JSON.stringify(updatedBudget));
};

const handleGoalChange = (index, field, value) => {
    const updatedGoals = [...goals];
    updatedGoals[index][field] = field === 'name' ? value : Number(value);
    setGoals(updatedGoals);
    localStorage.setItem("goals", JSON.stringify(updatedGoals));
};

  // Form handling for investments
  const handleInvestmentChange = (index, field, value) => {
    const updatedInvestments = [...investments];
    
    if (field === 'percentage') {
      // Ensure percentages don't exceed 100%
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
    localStorage.setItem("investments", JSON.stringify(updatedInvestments));
  };

  // Color picker for categories
  const handleColorChange = (index, category, value) => {
    const updatedItems = category === 'budget' 
      ? [...budgetCategories] 
      : category === 'goals' 
        ? [...goals] 
        : [...investments];
    
    updatedItems[index].color = value;
    
    if (category === 'budget') {
      setBudgetCategories(updatedItems);
    } else if (category === 'goals') {
      setGoals(updatedItems);
    } else {
      setInvestments(updatedItems);
    }
  };

  // Add new item functions
  const addBudgetCategory = () => {
    setBudgetCategories([
      ...budgetCategories, 
      { name: "New Category", spent: 0, budget: 0, color: "#" + Math.floor(Math.random()*16777215).toString(16) }
    ]);
  };

  const addGoal = () => {
    setGoals([
      ...goals,
      { name: "New Goal", current: 0, target: 0, color: "#" + Math.floor(Math.random()*16777215).toString(16) }
    ]);
  };

  const addInvestment = () => {
    // Check if we still have room (less than 100%)
    const currentTotal = investments.reduce((sum, inv) => sum + inv.percentage, 0);
    if (currentTotal >= 100) {
      alert("Total investment percentage is already at 100%. Adjust existing investments before adding new ones.");
      return;
    }
    
    setInvestments([
      ...investments,
      { type: "New Investment", percentage: 0, color: "#" + Math.floor(Math.random()*16777215).toString(16) }
    ]);
  };

  // Remove item functions
  const removeItem = (index, category) => {
    if (category === 'budget') {
      setBudgetCategories(budgetCategories.filter((_, i) => i !== index));
    } else if (category === 'goals') {
      setGoals(goals.filter((_, i) => i !== index));
    } else {
      setInvestments(investments.filter((_, i) => i !== index));
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