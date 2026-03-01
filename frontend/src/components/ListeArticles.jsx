import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ListeArticles() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  // Récupérer les articles
  const fetchArticles = async () => {
    try {
      const res = await API.get("/articles");
      setArticles(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Supprimer article
  const handleDelete = async (id) => {
    try {
      await API.delete(`/articles/${id}`);
      fetchArticles();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Publier / Dépublier
  const togglePublish = async (id, published) => {
    try {
      await API.patch(`/articles/${id}/publish`, {
        published: !published,
      });
      fetchArticles();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Fonction pour afficher correctement tags et categories
  const displayCategory = (category) => {
    try {
      // si JSON string double encodée
      const cat = JSON.parse(category);
      return typeof cat === "string" ? cat : cat[0] || "-";
    } catch {
      return category || "-";
    }
  };

  const displayTags = (tags) => {
    if (!tags) return "-";
    try {
      const arr = Array.isArray(tags) ? tags : JSON.parse(tags);
      return arr
        .map((t) => {
          try {
            return JSON.parse(t); // enlever guillemets superflus
          } catch {
            return t;
          }
        })
        .join(", ");
    } catch {
      return tags;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Liste des Articles</h2>

      <table border="1" cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Content</th>
            <th>Image</th>
            <th>Catégories</th>
            <th>Tags</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <td
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => navigate(`/articles/${article.id}`)}
              >
                {article.title}
              </td>

              <td>{article.content}</td>

              <td>
                {article.image ? (
                  <img src={article.image} alt={article.title} width="100" />
                ) : (
                  "Aucune image"
                )}
              </td>

              <td>{displayCategory(article.categories)}</td>
              <td>{displayTags(article.tags)}</td>

              <td>{article.published ? "Publié" : "Brouillon"}</td>

              <td>
                <button
                  onClick={() =>
                    togglePublish(article.id, article.published)
                  }
                >
                  {article.published ? "Dépublier" : "Publier"}
                </button>

                <button
                  onClick={() => handleDelete(article.id)}
                  style={{ marginLeft: "5px" }}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListeArticles;