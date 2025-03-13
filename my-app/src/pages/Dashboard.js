/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, CreditCard, TrendingUp, Target, BookOpen, Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { getAuth } from 'firebase/auth';
import { getUserProfile } from '../firebase/firestore';
import './styles/Dashboard.css';
import Information from './Information'; // Import the Information component

const Dashboard = () => {
    const navigate = useNavigate()
    const { logout, currentUser } = useAuth()
    const auth = getAuth();

    const [lastLogin, setLastLogin] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const [financialData, setFinancialData] = useState([
        { name: "Balance", value: 0 },
        { name: "Income", value: 0 },
        { name: "Expenses", value: 0 },
        { name: "Savings", value: 0 }
    ]);

    const [budgetCategories, setBudgetCategories] = useState([]);
    const [goals, setGoals] = useState([]);
    const [investments, setInvestments] = useState([]);

    const [showInformation, setShowInformation] = useState(false);

    // Firestore data sync
    useEffect(() => {
        const loadUserData = async () => {
            if (!currentUser) {
                setIsLoading(false);
                return;
            }

            try {
                const { success, data } = await getUserProfile(currentUser.uid);
                if (success && data) {
                    // Format the last login timestamp
                    const lastLoginDate = data.lastLogin ? new Date(data.lastLogin.toDate()) : new Date();
                    setLastLogin(lastLoginDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    }));

                    // Convert Firestore financial data to array format
                    setFinancialData([
                        { name: "Balance", value: data.financialData.currentBalance },
                        { name: "Income", value: data.financialData.income },
                        { name: "Expenses", value: data.financialData.expenses },
                        { name: "Savings", value: data.financialData.savings }
                    ]);

                    // Set other data
                    setBudgetCategories(data.budgetCategories || []);
                    setGoals(data.financialGoals || []);
                    setInvestments(data.investments || []);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, [currentUser]);

    // Progress bar component
    const ProgressBar = ({ spent, budget, color }) => {
        const percentage = Math.min(Math.round((spent / budget) * 100), 100);
        return (
            <div className="progress-bar-container">
                <div 
                    className="progress-bar"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                ></div>
            </div>
        );
    };

    const expensesToIncome = (financialData[2].value / financialData[1].value * 100).toFixed(0);
    const savingsToIncome = (financialData[3].value / financialData[1].value * 100).toFixed(0);

    // Donut chart for investments
    const DonutChart = ({ data }) => {
        let cumulativePercentage = 0;
        
        return (
            <div className="donut-chart-container">
                <svg viewBox="0 0 100 100" className="donut-chart">
                    {data.map((segment, index) => {
                        const startAngle = cumulativePercentage * 3.6;
                        cumulativePercentage += segment.percentage;
                        const endAngle = cumulativePercentage * 3.6;
                        
                        const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                        const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                        const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                        const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
                        
                        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
                        
                        const pathData = [
                            `M 50 50`,
                            `L ${x1} ${y1}`,
                            `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                            `Z`
                        ].join(' ');
                        
                        return (
                            <path 
                                key={index}
                                d={pathData}
                                fill={segment.color}
                            />
                        );
                    })}
                    <circle cx="50" cy="50" r="25" fill="white" />
                </svg>
            </div>
        );
    };

    // Toggle between dashboard and information views
    const toggleView = () => {
        setShowInformation(!showInformation);
    };

    return (
        <div className="dashboard">
            {isLoading ? (
                <h1 className="section-title">Loading...</h1>
            ) : (
                <>
                    {/* Navigation Bar */}
                    <nav className="navigation">
                        <div className="nav-container">
                            <div className="nav-right">
                                <span className="current-date">{currentDate}</span>
                                <button 
                                    className="edit-button" 
                                    onClick={toggleView}
                                    title={showInformation ? "View Dashboard" : "Edit Financial Information"}
                                >
                                    <Settings size={18} />
                                    {showInformation ? "Dashboard" : "Edit Data"}
                                </button>
                                <button onClick={() => { logout().then(() => { navigate('/') }) }}>Logout</button>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <div className="main-container">
                        {showInformation ? (
                            // Information component view
                            <Information
                                financialData={financialData}
                                setFinancialData={setFinancialData}
                                budgetCategories={budgetCategories}
                                setBudgetCategories={setBudgetCategories}
                                goals={goals}
                                setGoals={setGoals}
                                investments={investments}
                                setInvestments={setInvestments}
                            />
                        ) : (
                            // Regular Dashboard view
                            <>
                                {/* Welcome Section */}
                                <div className="card welcome-card">
                                    <div className="welcome-content">
                                        <div>
                                            <h2 className="welcome-title">Welcome back, {auth.currentUser?.displayName || 'User'}</h2>
                                            <p className="welcome-subtitle">Let's manage your finances today</p>
                                        </div>
                                        <div className="last-login">
                                            <Clock size={16} className="icon" />
                                            <span>Last login: {lastLogin}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Overview Section */}
                                <h2 className="section-title">
                                    <DollarSign size={20} className="section-icon" />
                                    Financial Overview
                                </h2>
                                <div className="financial-overview">
                                    <div className="overview-card">
                                        <h3 className="card-label">Total Balance</h3>
                                        <p className="card-value">${financialData[0].value.toLocaleString()}</p>
                                        <span className="card-trend positive">
                                            <TrendingUp size={14} className="trend-icon" />
                                            +2.5% this month
                                        </span>
                                    </div>
                                    <div className="overview-card">
                                        <h3 className="card-label">Monthly Income</h3>
                                        <p className="card-value">${financialData[1].value.toLocaleString()}</p>
                                        <span className="card-note">Next deposit: Apr 1</span>
                                    </div>
                                    <div className="overview-card">
                                        <h3 className="card-label">Monthly Expenses</h3>
                                        <p className="card-value">${financialData[2].value.toLocaleString()}</p>
                                        <span className="card-note">{expensesToIncome}% of income</span>
                                    </div>
                                    <div className="overview-card">
                                        <h3 className="card-label">Savings</h3>
                                        <p className="card-value">${financialData[3].value.toLocaleString()}</p>
                                        <span className="card-note">{savingsToIncome}% of income</span>
                                    </div>
                                </div>

                                <div className="dashboard-grid">
                                    {/* Left Column */}
                                    <div className="main-column">
                                        {/* Budget Tracking Section */}
                                        <div className="card">
                                            <h2 className="section-title">
                                                <CreditCard size={20} className="section-icon" />
                                                Budget Tracking
                                            </h2>
                                            <div className="budget-items">
                                                {budgetCategories.map((category, index) => (
                                                    <div key={index} className="budget-item">
                                                        <div className="budget-item-header">
                                                            <span className="budget-category">{category.name}</span>
                                                            <span className="budget-amount">${category.spent} / ${category.budget}</span>
                                                        </div>
                                                        <ProgressBar 
                                                            spent={category.spent} 
                                                            budget={category.budget} 
                                                            color={category.color} 
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Financial Goals Section */}
                                        <div className="card">
                                            <h2 className="section-title">
                                                <Target size={20} className="section-icon" />
                                                Financial Goals
                                            </h2>
                                            <div className="goals-list">
                                                {goals.map((goal, index) => (
                                                    <div key={index} className="goal-item">
                                                        <div className="goal-item-header">
                                                            <span className="goal-name">{goal.name}</span>
                                                            <span className="goal-progress">
                                                                ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <ProgressBar 
                                                            spent={goal.current} 
                                                            budget={goal.target} 
                                                            color={goal.color} 
                                                        />
                                                    </div>
                                                ))}
                                                <button className="add-goal-button" onClick={toggleView}>
                                                    Add New Goal
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="side-column">
                                        {/* Investment Portfolio Section */}
                                        <div className="card">
                                            <h2 className="section-title">
                                                <TrendingUp size={20} className="section-icon" />
                                                Investment Breakdown
                                            </h2>
                                            <DonutChart data={investments} />
                                            <div className="investment-legend">
                                                {investments.map((item, index) => (
                                                    <div key={index} className="legend-item">
                                                        <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                                                        <span className="legend-text">{item.type} ({item.percentage}%)</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Financial Education Section */}
                                        <div className="card">
                                            <h2 className="section-title">
                                                <BookOpen size={20} className="section-icon" />
                                                Financial Education
                                            </h2>
                                            <div className="tip-section">
                                                <h3 className="subsection-title">Today's Tip</h3>
                                                <p className="tip-text">Consider setting up automatic transfers to your savings account on payday to build your emergency fund faster.</p>
                                            </div>
                                            <h3 className="subsection-title">Learning Resources</h3>
                                            <ul className="resource-list">
                                                {['Budgeting Basics', 'Investment Fundamentals', 'Debt Management', 'Tax Planning'].map((item, index) => (
                                                    <li key={index} className="resource-item">
                                                        <a href="#" className="resource-link">{item}</a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Alerts and Notifications Section */}
                                        <div className="card">
                                            <h2 className="section-title">
                                                <Bell size={20} className="section-icon" />
                                                Alerts & Notifications
                                            </h2>
                                            <ul className="alert-list">
                                                <li className="alert warning">
                                                    Utility bill payment due in 3 days
                                                </li>
                                                <li className="alert danger">
                                                    You're over budget on Entertainment by 10%
                                                </li>
                                                <li className="alert info">
                                                    Market update: Your investments grew by 2.3% this week
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <footer className="footer">
                        <div className="footer-container">
                            <p className="copyright">© 2025 AurumAI. All rights reserved.</p>
                            <div className="footer-links">
                                <a href="#" className="footer-link">Privacy Policy</a>
                                <a href="#" className="footer-link">Terms of Service</a>
                                <a href="#" className="footer-link">Contact Support</a>
                            </div>
                        </div>
                    </footer>
                </>
            )}
        </div>
    );
};

export default Dashboard;