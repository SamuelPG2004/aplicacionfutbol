


function initEquipoClicks() {
    const equipos = document.querySelectorAll(".equipo");
    equipos.forEach(eq => {
      eq.addEventListener("click", () => handleEquipoClick(eq));
    });
  }
  
 
  function handleEquipoClick(elemento) {
    const id = elemento.getAttribute("data-id");
    redirigirAEquipo(id);
  }
  

  function redirigirAEquipo(id) {
    window.location.href = `equipo.html?id=${id}`;
  }
  
  
  document.addEventListener("DOMContentLoaded", initEquipoClicks);
  