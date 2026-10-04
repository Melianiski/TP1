/* ========================================
   ALMACENAMIENTO EN EL NAVEGADOR
   ======================================== */

if (localStorage.getItem("nombreJugador") === null) {
    const nombre = (prompt("¡Bienvenido/a! Ingresá tu nombre:") || "Invitado").trim().slice(0, 12) || "Invitado";
    localStorage.setItem("nombreJugador", nombre);
}


