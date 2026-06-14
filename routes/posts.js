const express         = require('express');
const router          = express.Router();
const db              = require('../db');
const verificarToken  = require('../middleware/auth');

// GET /api/posts — público, cualquiera puede leer
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM posts ORDER BY creado_en DESC');
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/posts/:id — público
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ ok: false, error: 'Post no encontrado.' });
    res.json({ ok: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/posts — protegido
router.post('/', verificarToken, async (req, res) => {
  const { titulo, contenido, autor } = req.body;
  if (!titulo || !contenido)
    return res.status(400).json({ ok: false, error: 'Titulo y contenido son obligatorios.' });
  try {
    const [result] = await db.query(
      'INSERT INTO posts (titulo, contenido, autor) VALUES (?, ?, ?)',
      [titulo, contenido, autor || req.usuario.nombre]
    );
    res.status(201).json({ ok: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// PUT /api/posts/:id — protegido
router.put('/:id', verificarToken, async (req, res) => {
  const { titulo, contenido, autor } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE posts SET titulo = ?, contenido = ?, autor = ? WHERE id = ?',
      [titulo, contenido, autor, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ ok: false, error: 'Post no encontrado.' });
    res.json({ ok: true, mensaje: 'Post actualizado.' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// DELETE /api/posts/:id — protegido
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ ok: false, error: 'Post no encontrado.' });
    res.json({ ok: true, mensaje: 'Post eliminado.' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
