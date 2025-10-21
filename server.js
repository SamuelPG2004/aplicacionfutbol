
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Permitir CORS
app.use(cors());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Claves de API
const API_KEY_FOOTBALLDATA = '5fce32a19c334f348cfda7c56bc8062e';
const API_KEY_RAPIDAPI = '2847a81de1mshafe52a014db2fc8p18a695jsn5d834e2964f8';

// ------------------ Standings (Football-Data.org) ------------------
app.get('/api/standings', async (req, res) => {
    try {
        const response = await fetch('https://api.football-data.org/v4/competitions/PD/standings', {
            headers: { 'X-Auth-Token': API_KEY_FOOTBALLDATA }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener standings' });
    }
});

// ------------------ Buscar jugadores/equipos (RapidAPI) ------------------
app.get('/api/equipo', async (req, res) => {
    const { search } = req.query;
    if (!search) return res.status(400).json({ error: 'Falta parámetro search' });

    try {
        const response = await fetch(`https://free-api-live-football-data.p.rapidapi.com/football-players-search?search=${encodeURIComponent(search)}`, {
            headers: {
                'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
                'x-rapidapi-key': API_KEY_RAPIDAPI
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar equipo/jugador' });
    }
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
