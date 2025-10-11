
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors()); 

const API_KEY = '3b8c191dfb7746bf0d3e735fa9cd524f';
const LEAGUE = 140; 
const SEASON = 2025;


app.get('/jugadores', async (req, res) => {
  const page = req.query.page || 1;
  try {
    const response = await fetch(`https://v3.football.api-sports.io/players?league=${LEAGUE}&season=${SEASON}&page=${page}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'v3.football.api-sports.io'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Servidor escuchando en http://localhost:3000'));
