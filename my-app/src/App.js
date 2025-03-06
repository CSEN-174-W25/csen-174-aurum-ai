// Router
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Pages
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Advice from "./pages/Advice";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Components
import Navbar from "./components/navbar";

// Create a wrapper component to handle the navbar logic
const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/register']; // paths where navbar should be hidden
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/advice" element={<Advice />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;