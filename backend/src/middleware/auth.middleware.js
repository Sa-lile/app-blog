const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier le token CSRF
const csrfProtection = (req, res, next) => {
  const csrfToken = req.headers['x-csrf-token'];
  if (!csrfToken || csrfToken !== req.session.csrfToken) {
    return res.status(403).json({ message: 'CSRF token manquant ou invalide' });
  }
  next();
};  

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès interdit' });
  next();
};

module.exports = { verifyToken, csrfProtection, isAdmin };
