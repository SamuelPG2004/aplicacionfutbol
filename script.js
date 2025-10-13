
// URLs de los proxies PHP
const urlEquipos = 'http://localhost/aplicacion-main/proxyTabla.php';
const urlJugadores = 'http://localhost/aplicacion-main/proxyJugadores.php';

// Contenedores en HTML
const equiposContainer = document.getElementById('equiposContainer');
const statsContainer = document.getElementById('statsContainer');
const buscarInput = document.getElementById('buscarEquipo');
const tablaJugadoresContainer = document.getElementById('tablaJugadoresContainer');

let equipos = [];

// -------------------- CARGAR EQUIPOS --------------------
async function cargarEquipos() {
    try {
        const response = await fetch(urlEquipos);
        const data = await response.json();

        equipos = data.standings[0].table.map(team => ({
            nombre: team.team.name,
            id: team.team.id,
            stats: team
        }));

        renderEquipos(equipos);

    } catch (error) {
        console.error("Error cargando equipos:", error);
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
}

// Scroll botones
document.getElementById('prevBtn').onclick = () => {
    equiposContainer.scrollBy({ left: -200, behavior: 'smooth' });
};
document.getElementById('nextBtn').onclick = () => {
    equiposContainer.scrollBy({ left: 200, behavior: 'smooth' });
};

// Buscar equipos
buscarInput.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = equipos.filter(eq => eq.nombre.toLowerCase().includes(texto));
    renderEquipos(filtrados);
});

// Inicial
cargarEquipos();

// -------------------- CARGAR JUGADORES --------------------
async function cargarJugadores() {
    try {
        const response = await fetch(urlJugadores);
        const data = await response.json();

        const jugadores = data.response;

        let html = '<table class="tabla-liga"><thead><tr><th>Jugador</th><th>Edad</th><th>Equipo</th><th>Posición</th><th>Partidos</th><th>Goles</th><th>Asistencias</th></tr></thead><tbody>';

        jugadores.forEach(j => {
            const stats = j.statistics[0];
            const foto = j.player.photo || 'img/default-player.png'; 

            html += `<tr>
                <td><img src="${foto}" alt="${j.player.name}" class="jugador-img"> ${j.player.name}</td>
                <td>${j.player.age}</td>
                <td>${stats.team.name}</td>
                <td>${stats.games.position}</td>
                <td>${stats.games.appearences || 0}</td>
                <td>${stats.goals.total || 0}</td>
                <td>${stats.goals.assists || 0}</td>
            </tr>`;
        });

        html += '</tbody></table>';
        tablaJugadoresContainer.innerHTML = html;

    } catch (err) {
        console.error("Error cargando jugadores:", err);
        tablaJugadoresContainer.innerHTML = '<p>Error al cargar los datos.</p>';
    }
}

// Inicial
cargarJugadores();
