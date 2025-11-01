
// server.js
require('dotenv').config(); // Carga variables de entorno desde .env

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Configuración de CORS (permite cualquier origen)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Auth-Token']
}));

// ✅ Middleware de CSP (Content Security Policy)
app.use((req, res, next) => {
  // CSP: permitir recursos del propio servidor y de la API que usamos.
  // Añadimos connect-src para permitir fetch hacia la API y hacia localhost
  // durante desarrollo.
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' https://cdn-uicons.flaticon.com https://fonts.googleapis.com 'unsafe-inline'; " +
    "font-src 'self' https://fonts.gstatic.com https://cdn-uicons.flaticon.com; " +
    "img-src 'self' data: https://crests.football-data.org; " +
    "connect-src 'self' http://localhost:3000 https://api.football-data.org;"
  );
  next();
});

// Servir archivos estáticos desde la raíz del proyecto
// (el proyecto tiene index.html y assets en el directorio raíz)
app.use(express.static(path.join(__dirname)));

// Ruta explícita para la raíz: devolver index.html si existe
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Clave de API desde .env
const API_KEY_FOOTBALLDATA = process.env.FOOTBALLDATA_KEY;

// ✅ Proxy hacia Football-Data.org
app.use('/football', createProxyMiddleware({
  target: 'https://api.football-data.org',
  changeOrigin: true,
  pathRewrite: { '^/football': '' },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('X-Auth-Token', API_KEY_FOOTBALLDATA);
  }
}));

// Endpoint: Standings de LaLiga (usando fetch directo)
app.get('/api/standings', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.football-data.org/v4/competitions/PD/standings',
      { headers: { 'X-Auth-Token': API_KEY_FOOTBALLDATA } }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error en /api/standings:", error);
    res.status(500).json({ error: 'Error al obtener standings' });
  }
});

// Endpoint: Partidos de un equipo (usando fetch directo)
app.get('/api/teams/:teamId/matches', async (req, res) => {
  const { teamId } = req.params;
  const { status } = req.query; // FINISHED o SCHEDULED
  try {
    const response = await fetch(
      `https://api.football-data.org/v4/teams/${teamId}/matches?status=${status}`,
      { headers: { 'X-Auth-Token': API_KEY_FOOTBALLDATA } }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error en /api/teams/:teamId/matches:", error);
    res.status(500).json({ error: 'Error al obtener partidos' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`API Key cargada: ${API_KEY_FOOTBALLDATA ? 'OK' : 'No encontrada'}`);
});
