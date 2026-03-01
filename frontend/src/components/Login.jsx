import API from "../services/api";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Login.css';


function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", formData);
    try {
        const res = await API.post('/login', formData);
        console.log("Response status:", res.status);
        
        if (res.status === 200) {
            alert("Login successful!");
            navigate("/articles");
        } else {
            alert("Login failed: " + res.data.message);
        }
    } catch (error) {
        console.error("Erreur détaillée :", error.response ? error.response.data : error.message);
        console.error("Status code:", error.response?.status);
        alert("Login failed : " + (error.response?.data?.message || "Erreur serveur"));
    }
};


    return (
        <div className="login-container">
            <form className="login-box" onSubmit={handleLogin}>
                <h3>Connexion</h3>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit" onClick={()=>navigate("/articles")}>Valider</button>
                <button
                    className="btn-create"
                    type="button"
                    onClick={() => navigate("/register")}
                >
                    Créer un compte
                </button>
            </form>
        </div>
    );
}

export default Login;