// equipo.js

// 1. Obtener el ID de la URL
const params = new URLSearchParams(window.location.search);
const equipoId = params.get("id");

// 2. Referencias al DOM
const titulo = document.getElementById("titulo");
const equipoHeaderContainer = document.getElementById("equipoHeaderContainer");
const equipoStats = document.getElementById("equipoStats");
const ultimosPartidos = document.getElementById("ultimosPartidos");
const proximosPartidos = document.getElementById("proximosPartidos");

// 3. Cargar estadísticas básicas del equipo desde standings
async function cargarEstadisticas() {
  try {
    const res = await fetch("/api/standings");
    const data = await res.json();

    const equipo = data.standings[0].table.find(t => t.team.id == equipoId);

    if (!equipo) {
      titulo.textContent = "Equipo no encontrado";
      equipoStats.innerHTML = "<p>No se encontraron estadísticas</p>";
      return;
    }

    titulo.textContent = equipo.team.name;

    // Header con escudo y nombre
    const crestUrl = equipo.team.crest || '';
    equipoHeaderContainer.innerHTML = `
      <div class="equipo-header">
        <img class="escudo-equipo" src="${crestUrl}" alt="Escudo ${equipo.team.name}" onerror="this.style.display='none'">
        <div class="equipo-info">
          <h2>${equipo.team.name}</h2>
          <p>Posición: ${equipo.position} • Puntos: ${equipo.points}</p>
        </div>
      </div>
    `;

    // Estadísticas detalladas
    equipoStats.innerHTML = `
      <ul>
        <li>Partidos jugados: ${equipo.playedGames}</li>
        <li>Victorias: ${equipo.won}</li>
        <li>Empates: ${equipo.draw}</li>
        <li>Derrotas: ${equipo.lost}</li>
      </ul>
    `;
  } catch (err) {
    equipoStats.innerHTML = "<p>Error cargando estadísticas</p>";
    console.error("Error en cargarEstadisticas:", err);
  }
}

// 4. Cargar últimos partidos
async function cargarUltimosPartidos() {
  try {
    const res = await fetch(`/api/teams/${equipoId}/matches?status=FINISHED`);
    const data = await res.json();

    ultimosPartidos.innerHTML = "";
    // Mostrar los últimos 5 partidos (más recientes al final)
    const últimos = data.matches.slice(-5).reverse();
    últimos.forEach(m => {
      const div = document.createElement("div");
      div.classList.add("partido-card");
      div.dataset.matchId = m.id;
      div.style.cursor = 'pointer';

      const localScore = m.score.fullTime.home ?? '-';
      const awayScore = m.score.fullTime.away ?? '-';

      div.innerHTML = `
        <div class="partido-teams">
          <div class="team-block">
            <img class="escudo" src="${m.homeTeam.crest || ''}" alt="${m.homeTeam.name}" onerror="this.style.display='none'">
            <div class="team-name">${m.homeTeam.name}</div>
          </div>
        </div>

        <div class="match-score">${localScore} - ${awayScore}</div>

        <div class="partido-teams">
          <div class="team-block">
            <img class="escudo" src="${m.awayTeam.crest || ''}" alt="${m.awayTeam.name}" onerror="this.style.display='none'">
            <div class="team-name">${m.awayTeam.name}</div>
          </div>
        </div>
      `;

      // Abrir modal con detalle al hacer click
      div.addEventListener('click', () => openMatchModal(m.id));
      ultimosPartidos.appendChild(div);
    });
  } catch (err) {
    ultimosPartidos.innerHTML = "<p>Error cargando últimos partidos</p>";
    console.error("Error en cargarUltimosPartidos:", err);
  }
}

// 5. Cargar próximos partidos
async function cargarProximosPartidos() {
  try {
    const res = await fetch(`/api/teams/${equipoId}/matches?status=SCHEDULED`);
    const data = await res.json();

    proximosPartidos.innerHTML = "";
    const proximos = data.matches.slice(0, 8);
    proximos.forEach(m => {
      const div = document.createElement("div");
      div.classList.add("partido-card");
      div.dataset.matchId = m.id;
      div.style.cursor = 'pointer';

      const date = new Date(m.utcDate);
      const fechaStr = date.toLocaleString(undefined, { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

      div.innerHTML = `
        <div class="partido-teams">
          <div class="team-block">
            <img class="escudo" src="${m.homeTeam.crest || ''}" alt="${m.homeTeam.name}" onerror="this.style.display='none'">
            <div class="team-name">${m.homeTeam.name}</div>
          </div>
        </div>

        <div class="match-meta">${fechaStr}</div>

        <div class="partido-teams">
          <div class="team-block">
            <img class="escudo" src="${m.awayTeam.crest || ''}" alt="${m.awayTeam.name}" onerror="this.style.display='none'">
            <div class="team-name">${m.awayTeam.name}</div>
          </div>
        </div>
      `;

      // Abrir modal con detalle al hacer click
      div.addEventListener('click', () => openMatchModal(m.id));
      proximosPartidos.appendChild(div);
    });
  } catch (err) {
    proximosPartidos.innerHTML = "<p>Error cargando próximos partidos</p>";
    console.error("Error en cargarProximosPartidos:", err);
  }
}

// Modal: abrir y mostrar detalles del partido
async function openMatchModal(matchId) {
  const overlay = document.getElementById('matchModalOverlay');
  const title = document.getElementById('matchModalTitle');
  const eventsContainer = document.getElementById('matchEvents');
  const body = document.getElementById('matchModalBody');

  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  title.textContent = 'Cargando partido...';
  eventsContainer.innerHTML = '';

  try {
    const res = await fetch(`/football/v4/matches/${matchId}`);
    const data = await res.json();

    // Estructura defensiva: la API puede devolver data.match o data
    const match = data.match || data;
    const home = match.homeTeam || match.homeTeam;
    const away = match.awayTeam || match.awayTeam;
    const score = match.score || {};

    title.textContent = `${home?.name || 'Local'} ${score.fullTime?.home ?? '-'} - ${score.fullTime?.away ?? '-'} ${away?.name || 'Visitante'}`;

    // Eventos: intenta leer match.events, match.goalScorers, match.scorers
    const events = match.events || match.scorers || match.goalScorers || [];

    if (events && events.length) {
      // Mapear tipos y mostrar iconos/animaciones (gol, tarjeta, sustitución)
      const getEventType = (ev) => {
        const t = (ev.type || ev.detail || '').toLowerCase();
        if (t.includes('goal') || t.includes('gol') || t.includes('scorer')) return 'goal';
        if (t.includes('yellow')) return 'yellow';
        if (t.includes('red')) return 'red';
        if (t.includes('sub') || t.includes('sustit')) return 'sub';
        return 'other';
      };

      const svgFor = (type) => {
        if (type === 'goal') return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#FFD54A"/><path d="M8 12l2.5 2L16 9" stroke="#082" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        if (type === 'yellow') return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="12" height="16" rx="2" fill="#FFEB3B" stroke="#b88600" stroke-width="0.6"/></svg>`;
        if (type === 'red') return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="12" height="16" rx="2" fill="#FF5252" stroke="#b80000" stroke-width="0.6"/></svg>`;
        if (type === 'sub') return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h12" stroke="#69f" stroke-width="1.8" stroke-linecap="round"/><path d="M12 5l7 7-7 7" stroke="#69f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="#ccc"/></svg>`;
      };

      events.forEach(ev => {
        const left = document.createElement('div');
        const center = document.createElement('div');
        const right = document.createElement('div');

        const timeText = ev.minute ? `${ev.minute}'` : (ev.period || '');
        center.className = 'event-time';
        center.innerHTML = `<div class="event-time">${timeText}</div>`;

        const type = getEventType(ev);

        const teamId = ev.team?.id || ev.teamId || ev.team;
        const side = (teamId && String(teamId) === String(home?.id)) ? 'left' : (teamId && String(teamId) === String(away?.id) ? 'right' : 'right');

        const item = document.createElement('div');
        item.className = `event-item event-${type}`;

        const icon = document.createElement('div');
        icon.className = 'event-icon';
        icon.innerHTML = svgFor(type);

        const desc = document.createElement('div');
        desc.className = 'event-desc';
        if (ev.player) {
          const playerName = ev.player.name || ev.player;
          desc.textContent = `${ev.type || ''} — ${playerName}`;
        } else if (ev.scorer || ev.scorers) {
          const name = ev.scorer?.name || (Array.isArray(ev.scorers) ? ev.scorers.map(s=>s.name).join(', ') : JSON.stringify(ev.scorers));
          desc.textContent = `${ev.type || 'Gol'} — ${name}`;
        } else if (ev.name) {
          desc.textContent = `${ev.type || ''} — ${ev.name}`;
        } else {
          desc.textContent = ev.detail || ev.type || JSON.stringify(ev);
        }

        // colocar icon + desc en el item
        item.appendChild(icon);
        item.appendChild(desc);

        if (side === 'left') left.appendChild(item); else right.appendChild(item);

        eventsContainer.appendChild(left);
        eventsContainer.appendChild(center);
        eventsContainer.appendChild(right);
      });
    } else {
      // Si no hay eventos, mostrar info básica
      eventsContainer.innerHTML = `<div class="event-desc">No hay eventos disponibles. Estado: ${match.status || 'N/A'}</div>`;
    }

  } catch (err) {
    eventsContainer.innerHTML = `<div class="event-desc">Error cargando detalles del partido</div>`;
    console.error('Error en openMatchModal:', err);
  }
}

// Cerrar modal
function closeMatchModal() {
  const overlay = document.getElementById('matchModalOverlay');
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
}

// Listeners para cerrar
document.addEventListener('click', (e) => {
  const overlay = document.getElementById('matchModalOverlay');
  if (!overlay) return;
  if (e.target.id === 'matchModalClose') {
    closeMatchModal();
  }
  // click en overlay fuera del modal
  if (e.target.id === 'matchModalOverlay') {
    closeMatchModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMatchModal();
});

// Inicializar
cargarEstadisticas();
cargarUltimosPartidos();
cargarProximosPartidos();

// Actualización automática cada 5 minutos (300000 ms) - mantener sincronía con tabla.js
setInterval(() => {
  cargarEstadisticas();
  cargarUltimosPartidos();
  cargarProximosPartidos();
}, 300000);
