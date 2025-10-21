// equipo.js

// 1. Obtener el ID de la URL
const params = new URLSearchParams(window.location.search);
const equipoId = params.get("id");

// 2. Referencias al DOM
const titulo = document.getElementById("titulo");
const equipoStats = document.getElementById("equipoStats");
const ultimosPartidos = document.getElementById("ultimosPartidos");
const proximosPartidos = document.getElementById("proximosPartidos");

// 3. Cargar estadísticas básicas del equipo
async function cargarEstadisticas() {
  try {
    const res = await fetch(`http://localhost:3000/api/equipo/${equipoId}`);
    const data = await res.json();

    // RapidAPI devuelve dentro de response
    const team = data.response?.team || data.team || {};

    titulo.textContent = team.name || "Equipo";
    equipoStats.innerHTML = `
      <img src="${team.logo || team.crest}" alt="${team.name}" width="100">
      <ul>
        <li>Nombre: ${team.name || "N/D"}</li>
        <li>Fundado: ${team.founded || "N/D"}</li>
        <li>Estadio: ${team.venue?.name || "N/D"}</li>
        <li>Ciudad: ${team.venue?.city || "N/D"}</li>
      </ul>
    `;
  } catch (err) {
    equipoStats.innerHTML = "<p>Error cargando estadísticas</p>";
    console.error(err);
  }
}

// 4. Cargar últimos partidos
async function cargarUltimosPartidos() {
  try {
    const res = await fetch(`http://localhost:3000/api/equipo/${equipoId}/matches?status=finished`);
    const data = await res.json();

    ultimosPartidos.innerHTML = "";
    (data.response || data.matches || []).slice(-5).forEach(m => {
      const div = document.createElement("div");
      div.classList.add("partido-card");
      div.textContent = `${m.teams?.home?.name || m.homeTeam?.name} ${m.goals?.home ?? m.score?.fullTime?.home ?? "-"} - ${m.goals?.away ?? m.score?.fullTime?.away ?? "-"} ${m.teams?.away?.name || m.awayTeam?.name}`;
      ultimosPartidos.appendChild(div);
    });
  } catch (err) {
    ultimosPartidos.innerHTML = "<p>Error cargando últimos partidos</p>";
    console.error(err);
  }
}

// 5. Cargar próximos partidos
async function cargarProximosPartidos() {
  try {
    const res = await fetch(`http://localhost:3000/api/equipo/${equipoId}/matches?status=scheduled`);
    const data = await res.json();

    proximosPartidos.innerHTML = "";
    (data.response || data.matches || []).slice(0, 5).forEach(m => {
      const div = document.createElement("div");
      div.classList.add("partido-card");
      div.textContent = `${m.fixture?.date?.slice(0,10) || m.utcDate?.slice(0,10)}: ${m.teams?.home?.name || m.homeTeam?.name} vs ${m.teams?.away?.name || m.awayTeam?.name}`;
      proximosPartidos.appendChild(div);
    });
  } catch (err) {
    proximosPartidos.innerHTML = "<p>Error cargando próximos partidos</p>";
    console.error(err);
  }
}

// Inicializar
cargarEstadisticas();
cargarUltimosPartidos();
cargarProximosPartidos();
