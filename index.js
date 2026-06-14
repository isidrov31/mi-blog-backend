const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const postsRouter = require('./routes/posts');
const authRouter  = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Rutas
app.use('/api/auth',  authRouter);
app.use('/api/posts', postsRouter);

app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API de mi blog funcionando' });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
