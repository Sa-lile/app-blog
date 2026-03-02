import API from "../services/api";
import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.username || !form.email || !form.password) {
      setError("Tous les champs sont requis");
      return;
    }
    try {
      const res = await API.post("/register", form);

      if (res.status === 200) {
            alert("Inscription réussie !");
            navigate("/login");
        } else {
            alert("Inscription échouée : " + res.data.message);
        }
      } catch (err) {
      console.error("Erreur détaillée :", err.response ? err.response.data : err.message);
      console.error("Status code:", err.response?.status);
      setError("Inscription échouée : " + (err.response?.data?.message || "Erreur serveur"));
    }
  };


  return (
    <div className="register-container">
      <div className="register-box">
        <h3>Créer un compte</h3>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <button type="submit" onClick={() => navigate("/login")}>Valider</button>
        </form>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}