/* ========================================
   VARIABLES DEL ESTADO DEL JUEGO
   ======================================== */

const totalPreguntas = 10;
const segundosPorPregunta = 20;

let listaPreguntas = [];
let preguntaActual = 0;
let puntos = 0;
let nombreJugador = "";
let intervaloTimer = null;
let tiempoRestante = segundosPorPregunta;
let yaRespondio = false;


/* ========================================
   CAPTURAS DOM
   ======================================== */

const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaFinal = document.getElementById("pantalla-final");

const formConfig = document.getElementById("form-config");
const selectCategoria = document.getElementById("categoria");
const selectDificultad = document.getElementById("dificultad");
const btnJugar = document.getElementById("btn-jugar");
const mensajeEstado = document.getElementById("mensaje-estado");

const infoPregunta = document.getElementById("info-pregunta");
const infoPuntaje = document.getElementById("info-puntaje");
const infoTiempo = document.getElementById("info-tiempo");
const barraTiempo = document.getElementById("barra-tiempo");
const textoPregunta = document.getElementById("texto-pregunta");
const contenedorOpciones = document.getElementById("opciones");
const feedback = document.getElementById("feedback");
const btnSiguiente = document.getElementById("btn-siguiente");

const resumenFinal = document.getElementById("resumen-final");
const btnReiniciar = document.getElementById("btn-reiniciar");


/* ========================================
   FUNCIONES AUXILIARES
   ======================================== */

// OpenTDB devuelve el texto con entidades HTML (&quot;, &#039;, etc.)
// Este truco usa un elemento invisible para "traducirlas" a texto normal.
function decodificarTexto(texto) {
    const aux = document.createElement("textarea");
    aux.innerHTML = texto;
    return aux.value;
}

// Mezcla un array en el lugar (mismo algoritmo que usamos para el mazo de Cartas)
function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


/* ========================================
   OBTENER PREGUNTAS DESDE LA API
   ======================================== */

function empezarTrivia(evento) {
    // Evita que el formulario recargue la página
    evento.preventDefault();

    nombreJugador = localStorage.getItem("nombreJugador") || "Jugador";

    const url = "https://opentdb.com/api.php?amount=" + totalPreguntas +
                "&category=" + selectCategoria.value +
                "&difficulty=" + selectDificultad.value +
                "&type=multiple";

    btnJugar.disabled = true;
    mensajeEstado.textContent = "Cargando preguntas...";

    fetch(url)
        .then(function (respuesta) {
            // Error 429: la API permite 1 pedido cada 5 segundos
            if (respuesta.status === 429) {
                throw new Error("Muchos pedidos seguidos. Esperá unos segundos e intentá de nuevo.");
            }
            return respuesta.json();
        })
        .then(function (datos) {
            // response_code 0 significa que todo salió bien
            if (datos.response_code !== 0) {
                throw new Error("No hay suficientes preguntas para esa categoría y dificultad. Probá con otra.");
            }

            listaPreguntas = datos.results;
            preguntaActual = 0;
            puntos = 0;

            mensajeEstado.textContent = "";
            pantallaInicio.hidden = true;
            pantallaJuego.hidden = false;

            mostrarPregunta();
        })
        .catch(function (error) {
            mensajeEstado.textContent = error.message;
            console.log(error);
        })
        .finally(function () {
            btnJugar.disabled = false;
        });
}


/* ========================================
   MOSTRAR UNA PREGUNTA
   ======================================== */

function mostrarPregunta() {
    const pregunta = listaPreguntas[preguntaActual];

    yaRespondio = false;
    feedback.textContent = "";
    feedback.className = "mensaje";
    btnSiguiente.hidden = true;

    infoPregunta.textContent = "Pregunta " + (preguntaActual + 1) + "/" + totalPreguntas;
    infoPuntaje.textContent = "Puntaje: " + puntos;
    textoPregunta.textContent = decodificarTexto(pregunta.question);

    // Armamos un array con las 4 opciones (1 correcta + 3 incorrectas) y lo mezclamos
    const opciones = pregunta.incorrect_answers.slice(); // copia del array
    opciones.push(pregunta.correct_answer);
    mezclarArray(opciones);

    contenedorOpciones.innerHTML = "";

    for (let i = 0; i < opciones.length; i++) {
        const opcionTexto = opciones[i];
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = decodificarTexto(opcionTexto);
        boton.classList.add("opcion");

        boton.addEventListener("click", function () {
            responderPregunta(boton, opcionTexto, pregunta.correct_answer);
        });

        contenedorOpciones.appendChild(boton);
    }

    iniciarTimer();
}


/* ========================================
   TIMER
   ======================================== */

function iniciarTimer() {
    clearInterval(intervaloTimer);
    tiempoRestante = segundosPorPregunta;
    actualizarTimer();

    intervaloTimer = setInterval(function () {
        tiempoRestante--;
        actualizarTimer();

        if (tiempoRestante <= 0) {
            // null significa que no eligió ninguna opción
            responderPregunta(null, null, listaPreguntas[preguntaActual].correct_answer);
        }
    }, 1000);
}

function actualizarTimer() {
    infoTiempo.textContent = tiempoRestante + "s";
    barraTiempo.style.width = (tiempoRestante / segundosPorPregunta * 100) + "%";
}


/* ========================================
   PROCESAR RESPUESTA
   ======================================== */

function responderPregunta(botonElegido, opcionElegida, correcta) {
    // Si ya respondió esta pregunta, no hacemos nada
    if (yaRespondio) return;

    yaRespondio = true;
    clearInterval(intervaloTimer);

    // Deshabilitamos los botones y marcamos la correcta en verde
    const botones = document.querySelectorAll(".opcion");
    for (let i = 0; i < botones.length; i++) {
        botones[i].disabled = true;

        if (botones[i].textContent === decodificarTexto(correcta)) {
            botones[i].classList.add("correcta");
        }
    }

    if (opcionElegida === null) {
        feedback.textContent = "¡Se acabó el tiempo!";
        feedback.classList.add("error");
    } else if (opcionElegida === correcta) {
        puntos++;
        feedback.textContent = "¡Correcto! +1 punto";
        feedback.classList.add("ok");
    } else {
        botonElegido.classList.add("incorrecta");
        feedback.textContent = "Incorrecto.";
        feedback.classList.add("error");
    }

    infoPuntaje.textContent = "Puntaje: " + puntos;
    btnSiguiente.textContent = (preguntaActual === totalPreguntas - 1) ? "Ver resultado" : "Siguiente";
    btnSiguiente.hidden = false;
}

function avanzarPregunta() {
    preguntaActual++;

    if (preguntaActual >= totalPreguntas) {
        finalizarTrivia();
        return;
    }

    mostrarPregunta();
}


/* ========================================
   FIN DE LA TRIVIA
   ======================================== */

function finalizarTrivia() {
    resumenFinal.textContent = nombreJugador + ", acertaste " + puntos + " de " + totalPreguntas + " preguntas.";

    // Igual que dados y cartas
    const puntosActuales = Number(localStorage.getItem("puntosPreguntas")) || 0;
    localStorage.setItem("puntosPreguntas", puntosActuales + puntos);

    pantallaJuego.hidden = true;
    pantallaFinal.hidden = false;
}

function reiniciarTrivia() {
    pantallaFinal.hidden = true;
    pantallaInicio.hidden = false;
}


/* ========================================
   EVENTOS
   ======================================== */

formConfig.addEventListener("submit", empezarTrivia);
btnSiguiente.addEventListener("click", avanzarPregunta);
btnReiniciar.addEventListener("click", reiniciarTrivia);