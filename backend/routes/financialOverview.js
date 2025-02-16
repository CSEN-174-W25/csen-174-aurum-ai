const express = require("express");
const router = express.Router();

// Mock Financial Data (Replace with real data later)
const financialData = {
    income: 5000,
    expenses: 3000,
    budget: {
        savings: 1000,
        investments: 500,
        other: 500
    }
};

// GET request to return financial overview
router.get("/", (req, res) => {
    res.json(financialData);
});

module.exports = router;
