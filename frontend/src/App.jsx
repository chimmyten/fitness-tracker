import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

function App() {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if the user is authenticated

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
