document.getElementById("nombre-mostrado").textContent = localStorage.getItem("nombreJugador") || "Invitado";
document.getElementById("puntos-cartas").textContent = localStorage.getItem("puntosCartas") || "0";
document.getElementById("puntos-dados").textContent = localStorage.getItem("puntosDados") || "0";
document.getElementById("puntos-preguntas").textContent = localStorage.getItem("puntosPreguntas") || "0";