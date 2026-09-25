/* ========================================
   DATOS DEL MAZO
   ======================================== */

const palos = ["C", "D", "T", "P"];
const valores = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];


/* ========================================
   VARIABLES DEL ESTADO DEL JUEGO
   ======================================== */

let mazo = [];
let manoJugador = [];
let manoGato = [];
let turno = "jugador";      // puede valer "jugador", "gato" o "terminado"
let terminado = false;


/* ========================================
   CAPTURAS DOM
   ======================================== */

const contenedorCartasJugador = document.getElementById("cartas-jugador");
const contenedorCartasGato = document.getElementById("cartas-gato");
const puntajeJugadorSpan = document.getElementById("puntaje-jugador");
const puntajeGatoSpan = document.getElementById("puntaje-gato");
const mensajeEstado = document.getElementById("mensaje-estado");

const btnRepartir = document.getElementById("btn-repartir");
const btnPedir = document.getElementById("btn-pedir");
const btnPlantarse = document.getElementById("btn-plantarse");
const btnNuevaPartida = document.getElementById("btn-nueva-partida");


/* ========================================
   CREAR Y MEZCLAR EL MAZO
   ======================================== */

function crearMazo() {
    const mazoNuevo = [];

    for (let i = 0; i < palos.length; i++) {
        for (let j = 0; j < valores.length; j++) {
            mazoNuevo.push({
                valor: valores[j],
                palo: palos[i],
                imagen: "img/cartas/" + valores[j] + "_" + palos[i] + ".png"
            });
        }
    }

    return mazoNuevo;
}

function mezclar(mazoAMezclar) {
    for (let i = mazoAMezclar.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        const temp = mazoAMezclar[i];
        mazoAMezclar[i] = mazoAMezclar[j];
        mazoAMezclar[j] = temp;
    }

    return mazoAMezclar;
}


/* ========================================
   RENDERIZADO
   ======================================== */

function renderizarMano(mano, contenedor, ocultarSegunda) {
    contenedor.innerHTML = "";

    for (let i = 0; i < mano.length; i++) {
        const carta = mano[i];
        const img = document.createElement("img");
        img.classList.add("carta");

        if (ocultarSegunda === true && i === 1) {
            img.src = "img/cartas/reverso.png";
            img.alt = "Carta oculta";
        } else {
            img.src = carta.imagen;
            img.alt = carta.valor + " de " + carta.palo;
        }

        contenedor.appendChild(img);
    }
}

function actualizarInterfaz() {
    let gatoOculto = false;
    if (turno === "jugador") {
        gatoOculto = true;
    }

    renderizarMano(manoJugador, contenedorCartasJugador, false);
    renderizarMano(manoGato, contenedorCartasGato, gatoOculto);

    puntajeJugadorSpan.textContent = calcularPuntaje(manoJugador);

    if (gatoOculto === true) {
        puntajeGatoSpan.textContent = "?";
    } else {
        puntajeGatoSpan.textContent = calcularPuntaje(manoGato);
    }
}
