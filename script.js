

// script.js
const urlEquipos = 'http://localhost:3000/api/standings';

const equiposContainer = document.getElementById('equiposContainer');
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
        btn.innerHTML = `
            <img class="escudo" src="https://crests.football-data.org/${equipo.id}.svg" alt="${equipo.nombre}">
            ${equipo.nombre}
        `;

        // 👉 Redirigir a la página del equipo
        btn.onclick = () => {
            window.location.href = `equipo.html?id=${equipo.id}`;
        };

        equiposContainer.appendChild(btn);
    });
}

// -------------------- SCROLL BOTONES --------------------
document.getElementById('prevBtn').onclick = () => {
    equiposContainer.scrollBy({ left: -200, behavior: 'smooth' });
};
document.getElementById('nextBtn').onclick = () => {
    equiposContainer.scrollBy({ left: 200, behavior: 'smooth' });
};

// -------------------- BUSCAR EQUIPOS --------------------
buscarInput.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = equipos.filter(eq => eq.nombre.toLowerCase().includes(texto));
    renderEquipos(filtrados);
});


cargarEquipos();

