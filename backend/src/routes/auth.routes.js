const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const articleController = require("../controllers/article.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

// Routes pour l'authentification
router.post("/login", controller.login);
router.post("/register", controller.register);

// Routes pour les articles
router.get("/articles", articleController.getAllArticles);
router.post("/articles", articleController.createArticle);
router.put("/articles/:id", articleController.updateArticle);
router.delete("/articles/:id", articleController.deleteArticle);
router.patch("/articles/:id/publish", articleController.togglePublish);


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Requête SQL avec await → pas de callback
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (rows.length === 0) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }
    
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }
    // Succès
    res.status(200).json({ message: "Connexion réussie", userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 8);

    // Requête SQL pour insérer l'utilisateur
    const [result] = await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "Utilisateur enregistré", userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer un utilisateur (seulement admin)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});




module.exports = router;
 