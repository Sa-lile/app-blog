const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

describe('Backend MySQL + Auth + Blog', () => {
  let db;

  beforeAll(async () => {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'blogdb'
    });
  });

  afterAll(async () => {
    await db.end();
  });

  // --- Test1: hash password
  test('Hash password fonctionne', () => {
    const password = 'test123';
    const hash = bcrypt.hashSync(password, 8);
    const isValid = bcrypt.compareSync(password, hash);
    expect(isValid).toBe(true);
  });

  // --- Test2: CRUD utilisateur
  test('CRUD utilisateur', async () => {
    // CREATE
    const [insertResult] = await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      ['testuser', 'test@example.com', bcrypt.hashSync('test123', 8)]
    );
    const userId = insertResult.insertId;
    expect(userId).toBeGreaterThan(0);

    // READ
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    expect(rows.length).toBe(1);
    expect(rows[0].username).toBe('testuser');

    // UPDATE
    const [updateResult] = await db.execute(
      'UPDATE users SET username=? WHERE id=?',
      ['updateduser', userId]
    );
    expect(updateResult.affectedRows).toBe(1);

    // DELETE
    const [deleteResult] = await db.execute('DELETE FROM users WHERE id=?', [userId]);
    expect(deleteResult.affectedRows).toBe(1);
  });

  // --- Test3: CRUD articles
  test('CRUD article', async () => {
    // CREATE user d'abord
    const [userResult] = await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      ['articleuser', 'article@example.com', bcrypt.hashSync('pass123', 8)]
    );
    const userId = userResult.insertId;

    // CREATE article
    const [insertResult] = await db.execute(
      'INSERT INTO articles (title, content, user_id) VALUES (?, ?, ?)',
      ['Test Article', 'Contenu test', userId]
    );
    const articleId = insertResult.insertId;
    expect(articleId).toBeGreaterThan(0);

    // READ
    const [rows] = await db.execute('SELECT * FROM articles WHERE id = ?', [articleId]);
    expect(rows.length).toBe(1);
    expect(rows[0].title).toBe('Test Article');

    // UPDATE
    const [updateResult] = await db.execute(
      'UPDATE articles SET title=? WHERE id=?',
      ['Updated Article', articleId]
    );
    expect(updateResult.affectedRows).toBe(1);

    // DELETE article
    const [deleteResult] = await db.execute('DELETE FROM articles WHERE id=?', [articleId]);
    expect(deleteResult.affectedRows).toBe(1);

    // DELETE user
    await db.execute('DELETE FROM users WHERE id=?', [userId]);
  });

  // --- Test4: JWT
  test('JWT token valide et invalide', () => {
    const payload = { id: 1 };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Vérifier token valide
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(1);

    // Vérifier token invalide
    expect(() => {
      jwt.verify(token + 'xyz', process.env.JWT_SECRET);
    }).toThrow();
  });
});