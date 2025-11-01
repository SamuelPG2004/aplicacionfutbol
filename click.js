


function initEquipoClicks() {
  const equipos = document.querySelectorAll(".equipo");

  if (!equipos || equipos.length === 0) {
    console.warn("⚠️ No se encontraron elementos con clase .equipo");
    return;
  }

  equipos.forEach(eq => {
    eq.addEventListener("click", () => handleEquipoClick(eq));
  });
}

function handleEquipoClick(elemento) {
  if (!elemento) {
    console.error("❌ Elemento inválido en handleEquipoClick");
    return;
  }

  const id = elemento.getAttribute("data-id");

  if (!id) {
    console.error("❌ El elemento no tiene atributo data-id");
    return;
  }

  if (isNaN(id)) {
    console.error(`❌ El id "${id}" no es un número válido`);
    return;
  }

  redirigirAEquipo(id);
}

function redirigirAEquipo(id) {
  try {
    window.location.href = `equipo.html?id=${encodeURIComponent(id)}`;
  } catch (error) {
    console.error("❌ Error al redirigir a equipo:", error);
  }
}

document.addEventListener("DOMContentLoaded", initEquipoClicks);
