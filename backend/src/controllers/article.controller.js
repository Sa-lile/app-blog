const db = require("../config/db");
 
// Avec mysql2/promise, on fait toujours : pas de callback, on utilise await
// Récupérer tous les articles
const getAllArticles = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM articles"); 
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Créer un article
const createArticle = async (req, res) => {
  const { title, content, image, category, tags} = req.body;
   try {
    // 1.Insertion
    const [result] = await db.query(
      "INSERT INTO articles(title, content, image, category, tags) VALUES (?,?,?,?,?)",
      [title, content, image, JSON.stringify(category), JSON.stringify(tags)]
    );

    const insertedId = result.insertId;

    // 2.Récupération de l'article juste créé
    const [rows] = await db.query("SELECT * FROM articles WHERE id = ?", [insertedId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Impossible de récupérer l'article après insertion" });
    }

    // 3.Retour de l'article complet
    res.status(201).json({ message: "Article créé", article: rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Modifier un article
const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content, image, category, tags } = req.body;
  try {
    await db.query(
      "UPDATE articles SET title=?, content=?, image=?, category=?, tags=? WHERE id=?",
      [title, content, image, JSON.stringify(category), JSON.stringify(tags), id]
    );
    res.json({ message: "Article mis à jour" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un article
const deleteArticle = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM articles WHERE id=?", [id]);
    res.json({ message: "Article supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Publier / Dépublier
const togglePublish = async (req, res) => {
  const { id } = req.params;
  const { published } = req.body;
  try {
    await db.query(
      "UPDATE articles SET published=? WHERE id=?",
      [published ? 1 : 0, id]
    );
    res.json({ message: `Article ${published ? "publié" : "dépublié"}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  togglePublish
};