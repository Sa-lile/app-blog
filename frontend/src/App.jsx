import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Articles from "./components/Articles";
import { Navigate } from "react-router-dom";
import ListeArticles from "./components/ListeArticles";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ListeArticles />} />
      </Routes>
    </Router>
  );
}

export default App;