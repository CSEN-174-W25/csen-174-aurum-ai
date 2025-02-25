// Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Advice from "./pages/Advice";
import Information from "./pages/Information";

function App() {
  return (
<<<<<<< HEAD
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/advice" element={<Advice />} />
        <Route path="/information" element={<Information />} />
      </Routes>
    </Router>
=======
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/advice" element={<Advice />} />
        </Routes>
      </Router>
    </>
>>>>>>> dda8c18b (add Navbar component)
  );
}

export default App;