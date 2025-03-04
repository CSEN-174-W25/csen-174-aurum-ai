// Router
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Advice from "./pages/Advice";
import Login from "./pages/Login";

// Components
import Navbar from "./components/navbar";

// UseState
import { useState } from "react";

function App() {
  
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/advice" element={<Advice />} />
      </Routes>
    </Router>
  );
}

export default App;