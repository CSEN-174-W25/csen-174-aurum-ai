const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = process.env.SECRET_KEY || "mock_secret"; 

// Mock users
const users = [
  { id: 1, email: "test@example.com", password: bcrypt.hashSync("password", 10) },
];

// Login logic
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token, user: { id: user.id, email: user.email } });
};

// Protected route
exports.protectedRoute = (req, res) => {
  res.json({ message: "Protected content", user: req.user });
};