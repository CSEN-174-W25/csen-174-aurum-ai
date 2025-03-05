// Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Advice from "./pages/Advice";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Components
import Navbar from "./components/navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/advice" element={<Advice />} />
      </Routes>
    </Router>
  );
}

export default App;