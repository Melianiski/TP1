/* ========================================
   ALMACENAMIENTO EN EL NAVEGADOR
   ======================================== */

// Pedimos el nombre una sola vez, si no está guardado
if (localStorage.getItem("nombreJugador") === null) {
    let nombre = prompt("¡Bienvenido/a! Ingresá tu nombre:");

    if (nombre === null || nombre.trim() === "") {
        nombre = "Invitado";
    }

    localStorage.setItem("nombreJugador", nombre);
}