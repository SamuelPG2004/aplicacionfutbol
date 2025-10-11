
const apiKey = '5fce32a19c334f348cfda7c56bc8062e';
const url = 'https://api.football-data.org/v4/competitions/PD/standings';

const equiposContainer = document.getElementById('equiposContainer');
const statsContainer = document.getElementById('statsContainer');
const buscarInput = document.getElementById('buscarEquipo');

let equipos = [];
let scrollAmount = 0;


async function cargarEquipos() {
  try {
    const response = await fetch(url, { headers: { 'X-Auth-Token': apiKey } });
    const data = await response.json();

    equipos = data.standings[0].table.map(team => ({
      nombre: team.team.name,
      id: team.team.id,
      stats: team
    }));

    renderEquipos(equipos);

  } catch (error) {
    console.error("Error API:", error);
    equiposContainer.innerHTML = '<p>Error cargando equipos</p>';
  }
}


function renderEquipos(lista) {
  equiposContainer.innerHTML = '';
  lista.forEach(equipo => {
    const btn = document.createElement('button');
    btn.innerHTML = `<img class="escudo" src="https://crests.football-data.org/${equipo.id}.svg" alt="${equipo.nombre}">${equipo.nombre}`;
    btn.onclick = () => mostrarEstadisticas(equipo);
    equiposContainer.appendChild(btn);
  });
}


function mostrarEstadisticas(equipo) {
  statsContainer.style.display = 'flex';
  statsContainer.innerHTML = `
    <div class="stats-card">
      <h3>${equipo.nombre}</h3>
      <ul>
        <li>Posición: ${equipo.stats.position}</li>
        <li>Puntos: ${equipo.stats.points}</li>
        <li>Partidos Jugados: ${equipo.stats.playedGames}</li>
        <li>Victorias: ${equipo.stats.won}</li>
        <li>Empates: ${equipo.stats.draw}</li>
        <li>Derrotas: ${equipo.stats.lost}</li>
        <li>Goles a Favor: ${equipo.stats.goalsFor}</li>
        <li>Goles en Contra: ${equipo.stats.goalsAgainst}</li>
      </ul>
    </div>
  `;
  mostrarPosicionLiga (equipo, apiKey);
}


document.getElementById('prevBtn').onclick = () => {
  equiposContainer.scrollBy({ left: -200, behavior: 'smooth' });
};
document.getElementById('nextBtn').onclick = () => {
  equiposContainer.scrollBy({ left: 200, behavior: 'smooth' });
};


buscarInput.addEventListener('input', (e) => {
  const texto = e.target.value.toLowerCase();
  const filtrados = equipos.filter(eq => eq.nombre.toLowerCase().includes(texto));
  renderEquipos(filtrados);
});


cargarEquipos();
