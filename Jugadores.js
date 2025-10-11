class Jugador {
    constructor(nombre, equipo, foto, posicion, goles) {
      this.nombre = nombre;
      this.equipo = equipo;
      this.foto = foto;
      this.posicion = posicion;
      this.goles = goles;
    }
  }
  
  class Jugadores {
    constructor(url) {
      this.url = url;
      this.jugadores = [];
    }
  
    async cargarJugadores() {
      try {
        const response = await fetch(this.url);
        const data = await response.json();
  
        
        this.jugadores = data.response.map(j => new Jugador(
          j.player.name,
          j.statistics[0].team.name,
          j.player.photo,
          j.statistics[0].games.position,
          j.statistics[0].goals.total
        ));
  
        this.mostrarJugadores();
      } catch (error) {
        console.error("Error al obtener jugadores:", error);
      }
    }
  
    mostrarJugadores() {
      const container = document.getElementById('jugadoresContainer');
      container.innerHTML = '';
      this.jugadores.forEach(j => {
        const div = document.createElement('div');
        div.className = 'jugador-card';
        div.innerHTML = `
          <img src="${j.foto}" alt="${j.nombre}">
          <h4>${j.nombre}</h4>
          <p>${j.equipo}</p>
          <p>${j.posicion}</p>
          <p>Goles: ${j.goles}</p>
        `;
        container.appendChild(div);
      });
    }
  }
  
  
  const jugadores = new Jugadores('http://localhost:3000/jugadores');
  jugadores.cargarJugadores();
  