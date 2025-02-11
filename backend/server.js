require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || "mock_secret"; // Keep in .env

// Mock Users
const users = [
  { id: 1, email: "test@example.com", password: bcrypt.hashSync("password", 10) },
];

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token, user: { id: user.id, email: user.email } });
});

// Protected Route
app.get("/api/protected", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    res.json({ message: "Protected content", user: decoded });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));