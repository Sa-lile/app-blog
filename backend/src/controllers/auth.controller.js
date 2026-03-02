const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Inscription
const register = (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "username, email et password sont obligatoires",
    });
  }
  // Hashage du mot de passe (Sécurité)
  const hash = bcrypt.hashSync(password, 8);

  db.query(
    "INSERT INTO users(username,email,password) VALUES (?,?,?)",
    [username, email, hash],
    (err, result) => {
      if (err) {      // Cas email déjà existant
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "Email déjà utilisé"
          });
        }
        return res.status(500).send(err);
      }
      res.status(201).json({ 
        message: "User registered successfully", 
        userId: result.insertId,
        username, email });
    }
  );
 
};

// Connexion
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "email et password sont obligatoires",
    });
  }

   db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.length === 0)
        return res.status(401).json({ message: "User not found" });

      const user = result[0];
      const valid = bcrypt.compareSync(password, user.password);

      if (!valid)
        return res.status(401).json({ message: "Wrong password" });

      // Créer token JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "SECRET_KEY",
        { expiresIn: "1h" }
      );

      res.json({ token,
        user: { id: user.id, email: user.email, role: user.role },
      });
    }
  );
};

module.exports = {
  register,
  login
};
