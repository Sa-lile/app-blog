import API from "../services/api";
import { useState, useEffect } from "react";
import "./Articles.css";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
    category: "",
    tags: [],
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  // Récupérer articles
  const fetchArticles = async () => {
    try {
      const res = await API.get("/articles");
      setArticles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Gestion des champs
  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset formulaire
  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      image: "",
      category: "",
      tags: [],
    });
    setEditId(null);
  };

  // Créer article
  const handleCreate = async () => {
    await API.post("/articles", {
      ...form,
      published: 0,
      tags: form.tags,        // envoyer le tableau
    });
    resetForm();
    fetchArticles();
  };

  // Modifier article
  const modifierArticle = (id) => {
    const article = articles.find(a => a.id === id);
    if (article) {
      setForm({
        title: article.title,
        content: article.content,
        image: article.image,
        category: parseCategory(article.category),
        tags: parseTags(article.tags),
      });
      setEditId(id);
    }
  };

  //  Sauvegarder modification
  const handleUpdate = async () => {
    await API.put(`/articles/${editId}`, {
      ...form,
      tags: form.tags,  // tableau
    });
    resetForm();
    fetchArticles();
  };

  // Publier / Dépublier
  const togglePublish = async (id, published) => {
    await API.patch(`/articles/${id}`, {
      published: published ? 0 : 1
    });
    fetchArticles();
  };

  // Supprimer article
  const handleDelete = async (id) => {
    await API.delete(`/articles/${id}`);
    fetchArticles();
  };

  // Fonctions pour parser correctement category & tags
  const parseCategory = (category) => {
    try {
      const cat = JSON.parse(category);
      return typeof cat === "string" ? cat : cat[0] || "";
    } catch {
      return category || "";
    }
  };

  const parseTags = (tags) => {
    if (!tags) return [];
    try {
      const arr = Array.isArray(tags) ? tags : JSON.parse(tags);
      return arr.map(t => {
        try { return JSON.parse(t); } catch { return t; }
      });
    } catch {
      return Array.isArray(tags) ? tags : [];
    }
  };

  return (
    <div className="container">
      {/* FORMULAIRE */}
      <div className="card">
        <h2>Gestion des Articles</h2>

        <input
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="content"
          placeholder="Contenu"
          value={form.content}
          onChange={handleChange}
        />

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="">Choisir une catégorie</option>
          <option value="Tech">Tech</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Business">Business</option>
          <option value="Sport">Sport</option>
        </select>

        <div className="tags-group">
          {["Art", "Travel", "Food", "Music", "AI", "Sport", "Hobby"].map((tag) => (
            <label key={tag}>
              <input
                type="checkbox"
                value={tag}
                checked={form.tags.includes(tag)}
                onChange={() => {
                  setForm(prev => ({
                    ...prev,
                    tags: prev.tags.includes(tag)
                      ? prev.tags.filter(t => t !== tag)
                      : [...prev.tags, tag]
                  }));
                }}
              />
              {tag}
            </label>
          ))}
        </div>

        <div className="btn-group">
          {editId ? (
            <>
              <button onClick={handleUpdate}>Sauvegarder</button>
              <button onClick={resetForm}>Annuler</button>
            </>
          ) : (
            <button onClick={handleCreate}>Créer</button>
          )}
        </div>
      </div>

      {/* TABLEAU */}
      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Contenu</th>
            <th>Image</th>
            <th>Catégories</th>
            <th>Tags</th>
            {/* <th>Statut</th> */}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <td>{article.title}</td>
              <td>{article.content}</td>
              <td>
                {article.image ? <img src={article.image} alt={article.title} width="100" /> : "Aucune image"}
              </td>
              <td>{parseCategory(article.category)}</td>
              <td>{parseTags(article.tags).join(", ")}</td>
              {/* <td>{article.published ? "Publié" : "Brouillon"}</td> */}
              <td>
                <button className="btn-modifier" onClick={() => modifierArticle(article.id)}>Modifier</button>
                {/* <button className="btn-publish" onClick={() => togglePublish(article.id, article.published)}>
                  {article.published ? "Dépublier" : "Publier"}
                </button> */}
                <button className="btn-delete" onClick={() => handleDelete(article.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Articles;