require("dotenv").config({ quiet:true});
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const db = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const articleRoutes = require("./routes/articles.routes");
const { csrfProtection} = require("./middleware/auth.middleware");

const app = express();

// ------------------- 1. Middlewares généraux ------------------- //
// Permet au frontend d’accéder au backend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"]
}));

// Parser le JSON envoyé par le frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      message: "JSON invalide. Vérifiez le body et le header Content-Type: application/json",
    });
  }

  next(err);
});

// Protection Clickjacking
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// ------------------- 2. Sessions et CSRF ------------------- //
// Middleware pour les sessions (nécessaire pour stocker le token CSRF)
app.use(session({
  secret: 'secret123',       // clé secrète defaut
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  
}));

// Middleware pour générer un CSRF token dans la session
app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = Math.random().toString(36).substring(2);
  }
  next();
});

// Route pour récupérer le CSRF token
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.session.csrfToken });
});

// ------------------- 3. Routes ------------------- //
// Routes publiques
app.use("/", authRoutes);
app.use("/articles", articleRoutes);

// Exemple de route protégée avec CSRF
app.post('/protected', csrfProtection, (req, res) => {
  res.json({ message: 'Succès ! CSRF vérifié.' });
});

// Route racine
app.get('/', (req, res) => {
  res.send('Server running on http://localhost:3001');
});

// ------------------- 4. Démarrage serveur ------------------- //
app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});