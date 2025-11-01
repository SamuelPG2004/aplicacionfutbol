
// API base configurable via window.API_BASE (create config.js from config.sample.js before deploying)
const API_BASE = window.API_BASE || (location.hostname === 'localhost' ? 'http://localhost:3000' : '');
const urlTabla = (API_BASE ? API_BASE : '') + '/api/standings';
const tablaLigaContainer = document.getElementById('tablaLigaContainer');

async function cargarTabla() {
    try {
        const response = await fetch(urlTabla);
        const data = await response.json();

        const tabla = data.standings[0].table;

        let html = `<table class="tabla-liga">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Equipo</th>
                    <th>P</th>
                    <th>J</th>
                    <th>G</th>
                    <th>E</th>
                    <th>P</th>
                    <th>GF</th>
                    <th>GC</th>
                </tr>
            </thead>
            <tbody>`;

        tabla.forEach(fila => {
            html += `<tr>
                <td>${fila.position}</td>
                <td><img src="https://crests.football-data.org/${fila.team.id}.svg" alt="${fila.team.name}">${fila.team.name}</td>
                <td>${fila.points}</td>
                <td>${fila.playedGames}</td>
                <td>${fila.won}</td>
                <td>${fila.draw}</td>
                <td>${fila.lost}</td>
                <td>${fila.goalsFor}</td>
                <td>${fila.goalsAgainst}</td>
            </tr>`;
        });

        html += `</tbody></table>`;
        tablaLigaContainer.innerHTML = html;

    } catch (error) {
        console.error("Error cargando tabla:", error);
        tablaLigaContainer.innerHTML = '<p>Error cargando tabla de posiciones.</p>';
    }
}

// Carga inicial
cargarTabla();

// Actualización automática cada 5 minutos (300000 ms)
setInterval(cargarTabla, 300000);
