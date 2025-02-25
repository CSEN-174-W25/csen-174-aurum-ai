import React, { useState, useEffect } from "react";

const Information = () => {
  // State to store financial info
  const [formData, setFormData] = useState({
    income: "",
    expenses: "",
    savings: "",
    investmentGoals: "",
  });

  // Load stored data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("financialInfo");
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Save to localStorage)
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("financialInfo", JSON.stringify(formData));
    alert("Financial Information Updated!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Update Your Financial Information</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Income:
          <input type="number" name="income" value={formData.income} onChange={handleChange} />
        </label>
        <br />

        <label>
          Expenses:
          <input type="number" name="expenses" value={formData.expenses} onChange={handleChange} />
        </label>
        <br />

        <label>
          Savings:
          <input type="number" name="savings" value={formData.savings} onChange={handleChange} />
        </label>
        <br />

        <label>
          Investment Goals:
          <input type="text" name="investmentGoals" value={formData.investmentGoals} onChange={handleChange} />
        </label>
        <br />

        <button type="submit">Save Information</button>
      </form>
    </div>
  );
};

export default Information;