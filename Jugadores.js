const url = 'http://localhost/aplicacion-main/proxyJugadores.php'; // tu ruta local

fetch(url)
  .then(res => res.json())
  .then(data => {
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
    document.getElementById('tablaJugadoresContainer').innerHTML = html;
  })
  .catch(err => {
    console.error(err);
    document.getElementById('tablaJugadoresContainer').innerHTML = '<p>Error al cargar los datos.</p>';
  });
