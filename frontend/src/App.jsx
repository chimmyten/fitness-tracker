import { useState } from "react";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
    </Router>
  );
}

export default App;
