/* ========================================
   VARIABLES DEL ESTADO DEL JUEGO
   ======================================== */

const totalRondas = 5;
let rondaActual = 1;
let puntosPartida = 0;
let turnoActual = "jugador";   // "jugador" o "gato"
let eleccionUsuario = null;    // "par" o "impar", solo se usa en el turno del gato
let bloqueado = false;         // evita clicks mientras hay una animación en curso


/* ========================================
   CAPTURAS DOM
   ======================================== */

const infoRonda = document.getElementById("info-ronda");
const puntosPartidaTexto = document.getElementById("puntos-partida");
const mensajeEstadoDados = document.getElementById("mensaje-estado-dados");

const dado1 = document.getElementById("dado-1");
const dado2 = document.getElementById("dado-2");
const contenedorDados = document.getElementById("contenedor-dados");
const marcadorOculto = document.getElementById("marcador-oculto");

const controlesJugador = document.getElementById("controles-jugador");
const btnTirarJugador = document.getElementById("btn-tirar-jugador");

const controlesEleccion = document.getElementById("controles-eleccion");
const btnElegirPar = document.getElementById("btn-elegir-par");
const btnElegirImpar = document.getElementById("btn-elegir-impar");

const btnNuevaPartidaDados = document.getElementById("btn-nueva-partida-dados");


/* ========================================
   FUNCIONES DE DADOS
   ======================================== */

function obtenerValorAleatorioDado() {
    return Math.floor(Math.random() * 6) + 1;
}

function mostrarDados(valor1, valor2) {
    dado1.src = "img/dados/dado_" + valor1 + ".png";
    dado2.src = "img/dados/dado_" + valor2 + ".png";

    contenedorDados.hidden = false;
    marcadorOculto.hidden = true;
}

function ocultarDados() {
    contenedorDados.hidden = true;
    marcadorOculto.hidden = false;
}

// Simula la animación de "tirar" cambiando la imagen rápido varias veces.
// Al terminar, ejecuta la función que le pasamos como parámetro.
function animarDados(callback) {
    contenedorDados.hidden = false;
    marcadorOculto.hidden = true;

    let vueltas = 0;
    const totalVueltas = 35; // 15 x 100ms = 1.5 segundos de animación

    const intervalo = setInterval(function () {
        dado1.src = "img/dados/dado_" + obtenerValorAleatorioDado() + ".png";
        dado2.src = "img/dados/dado_" + obtenerValorAleatorioDado() + ".png";

        vueltas++;

        if (vueltas >= totalVueltas) {
            clearInterval(intervalo);
            callback();
        }
    }, 100);
}


/* ========================================
   TURNO DEL JUGADOR (tira el jugador, adivina el gato)
   ======================================== */

function iniciarTurnoJugador() {
    turnoActual = "jugador";

    mensajeEstadoDados.textContent = "Presioná \"Tirar dados\" para tirar.";
    mostrarDados(1, 1); // valor de referencia, no importa cuál mientras espera

    controlesJugador.hidden = false;
    controlesEleccion.hidden = true;
    btnTirarJugador.disabled = false;
}

function tirarDadosJugador() {
    if (bloqueado === true) {
        return;
    }

    bloqueado = true;
    btnTirarJugador.disabled = true;

    // Calculamos el resultado real ahora, pero no lo mostramos todavía
    const valor1 = obtenerValorAleatorioDado();
    const valor2 = obtenerValorAleatorioDado();
    const suma = valor1 + valor2;

    mensajeEstadoDados.textContent = "Tirando los dados...";

    animarDados(function () {
        // Terminó la animación: ocultamos el resultado real
        ocultarDados();
        mensajeEstadoDados.textContent = "El Gato Villano está pensando...";

        setTimeout(function () {
            const gatoAcierta = decidirSiElGatoAcierta();
            revelarTurnoJugador(valor1, valor2, suma, gatoAcierta);
        }, 1500);
    });
}

function decidirSiElGatoAcierta() {
    return Math.random() < 0.5; // 50% de probabilidad de que acierte
}

function revelarTurnoJugador(valor1, valor2, suma, gatoAcierta) {
    mostrarDados(valor1, valor2);

    const esPar = (suma % 2 === 0);
    const resultadoTexto = esPar ? "Par" : "Impar";

    let mensaje = "Sacaste " + valor1 + " y " + valor2 + " (" + resultadoTexto + "). ";

    if (gatoAcierta === true) {
        mensaje += "El Gato Villano adivinó. Perdiste esta ronda.";
    } else {
        mensaje += "¡El Gato Villano falló! Ganaste esta ronda.";
        sumarPunto();
    }

    mensajeEstadoDados.textContent = mensaje;
    bloqueado = false;

    setTimeout(avanzarRonda, 10000);
}


/* ========================================
   TURNO DEL GATO (tira el gato, adivina el jugador)
   ======================================== */

function iniciarTurnoGato() {
    turnoActual = "gato";
    eleccionUsuario = null;

    mensajeEstadoDados.textContent = "El Gato Villano va a tirar. Elegí Par o Impar.";
    mostrarDados(1, 1);

    controlesJugador.hidden = true;
    controlesEleccion.hidden = false;
}

function elegirParImpar(eleccion) {
    if (bloqueado === true) {
        return;
    }

    bloqueado = true;
    eleccionUsuario = eleccion;
    controlesEleccion.hidden = true;

    const valor1 = obtenerValorAleatorioDado();
    const valor2 = obtenerValorAleatorioDado();
    const suma = valor1 + valor2;

    mensajeEstadoDados.textContent = "El Gato Villano está tirando...";

    animarDados(function () {
        revelarTurnoGato(valor1, valor2, suma);
    });
}

function revelarTurnoGato(valor1, valor2, suma) {
    mostrarDados(valor1, valor2);

    const esPar = (suma % 2 === 0);
    const resultadoReal = esPar ? "par" : "impar";
    const resultadoTexto = esPar ? "Par" : "Impar";

    let mensaje = "El Gato Villano sacó " + valor1 + " y " + valor2 + " (" + resultadoTexto + "). ";

    if (eleccionUsuario === resultadoReal) {
        mensaje += "¡Acertaste! Ganaste esta ronda.";
        sumarPunto();
    } else {
        mensaje += "Fallaste esta ronda.";
    }

    mensajeEstadoDados.textContent = mensaje;
    bloqueado = false;

    setTimeout(avanzarRonda, 10000);
}


/* ========================================
   PUNTAJE Y AVANCE DE RONDAS
   ======================================== */

function sumarPunto() {
    puntosPartida++;
    puntosPartidaTexto.textContent = "Aciertos: " + puntosPartida + " / " + totalRondas;

    const puntosActuales = Number(localStorage.getItem("puntosDados")) || 0;
    localStorage.setItem("puntosDados", puntosActuales + 1);
}

function avanzarRonda() {
    rondaActual++;

    if (rondaActual > totalRondas) {
        finalizarPartida();
        return;
    }

    infoRonda.textContent = "Ronda " + rondaActual + " de " + totalRondas;

    // Rondas impares: tira el jugador. Rondas pares: tira el gato.
    if (rondaActual % 2 === 1) {
        iniciarTurnoJugador();
    } else {
        iniciarTurnoGato();
    }
}

function finalizarPartida() {
    mensajeEstadoDados.textContent = "Partida terminada. Acertaste " + puntosPartida + " de " + totalRondas + " rondas.";

    controlesJugador.hidden = true;
    controlesEleccion.hidden = true;
    btnNuevaPartidaDados.hidden = false;
}

function nuevaPartidaDados() {
    rondaActual = 1;
    puntosPartida = 0;
    bloqueado = false;

    infoRonda.textContent = "Ronda 1 de " + totalRondas;
    puntosPartidaTexto.textContent = "Aciertos: 0 / " + totalRondas;

    btnNuevaPartidaDados.hidden = true;

    iniciarTurnoJugador();
}


/* ========================================
   EVENTOS
   ======================================== */

btnTirarJugador.addEventListener("click", tirarDadosJugador);
btnElegirPar.addEventListener("click", function () {
    elegirParImpar("par");
});
btnElegirImpar.addEventListener("click", function () {
    elegirParImpar("impar");
});
btnNuevaPartidaDados.addEventListener("click", nuevaPartidaDados);

// Arranca la primera ronda apenas carga la página
iniciarTurnoJugador();