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


module.exports = router;
 