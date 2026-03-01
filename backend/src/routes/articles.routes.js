const db = require("../config/db");
const express = require("express");
const router = express.Router(); 
const articleController = require("../controllers/article.controller");


// GET tous les articles -> /api/articles
router.get('/', async (req, res) => {
    const [articles] = await db.query('SELECT * FROM articles');
    res.json(articles);
});

// POST créer un article
router.post('/', async (req, res) => {
    const { title, content, image, category, tag} = req.body;
    await db.query('INSERT INTO articles (title, content, image, category, tag) VALUES (?, ?, ?, ?, ?)',     
        [title, content, image, category, tag]);
    res.json({ success: true });
});

// PUT modifier un article
router.put('/:id', async (req, res) => {
    const { title, content, image, category, tag } = req.body;
    const { id } = req.params;
    await db.query('UPDATE articles SET title=?, content=?, image=?, category=?, tag=? WHERE id=?',
        [title, content, image, category, tag, id]);
    res.json({ success: true });
});

// DELETE supprimer un article
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM articles WHERE id=?', [id]);
    res.json({ success: true });
});

module.exports = router;
