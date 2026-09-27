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

/* ========================================
   CALCULO DE PUNTAJE
   ======================================== */

function calcularPuntaje(mano) {
    let total = 0;
    let ases = 0;

    for (let i = 0; i < mano.length; i++) {
        const carta = mano[i];

        if (carta.valor === "A") {
            total += 11;
            ases++;
        } else if (carta.valor === "J" || carta.valor === "Q" || carta.valor === "K") {
            total += 10;
        } else {
            total += Number(carta.valor);
        }
    }

    while (total > 21 && ases > 0) {
        total -= 10;
        ases--;
    }

    return total;
}


/* ========================================
   FIN DE RONDA
   ======================================== */

// OJO: esta función estaba antes definida DENTRO de turnoDelGato(),
// por eso pedirCarta() no la podía ver y tiraba error al usarla.
// Ahora vive a nivel superior, junto a las demás funciones del juego.
function terminarRonda(mensaje) {
    terminado = true;
    turno = "terminado";

    mensajeEstado.textContent = mensaje;

    btnPedir.disabled = true;
    btnPlantarse.disabled = true;
    btnNuevaPartida.hidden = false;

    actualizarInterfaz();
}


/* ========================================
   LÓGICA DEL JUEGO
   ======================================== */

function repartir() {
    mazo = mezclar(crearMazo());

    manoJugador = [];
    manoJugador.push(mazo.pop());
    manoJugador.push(mazo.pop());

    manoGato = [];
    manoGato.push(mazo.pop());
    manoGato.push(mazo.pop());

    turno = "jugador";
    terminado = false;

    mensajeEstado.textContent = "Elegí: pedir carta o plantarte.";

    btnRepartir.disabled = true;
    btnPedir.disabled = false;
    btnPlantarse.disabled = false;
    btnNuevaPartida.hidden = true;

    actualizarInterfaz();
}

function pedirCarta() {
    if (terminado === true) {
        return;
    }

    manoJugador.push(mazo.pop());
    actualizarInterfaz();

    const puntajeJugador = calcularPuntaje(manoJugador);

    if (puntajeJugador > 21) {
        terminarRonda("Te pasaste de 21. ¡Ganó el Gato Villano!");
    }
}

function plantarse() {
    if (terminado === true) {
        return;
    }

    turno = "gato";
    turnoDelGato();
}

function turnoDelGato() {
    const puntajeJugador = calcularPuntaje(manoJugador);

    // Si el jugador ya se pasó de 21, ni hace falta que el gato juegue:
    // el jugador pierde directo. Esto es un respaldo extra a la validación
    // que ya hace pedirCarta(), por si alguna vez se llega acá con el
    // jugador pasado de 21.
    if (puntajeJugador > 21) {
        terminarRonda("Te pasaste de 21. ¡Ganó el Gato Villano!");
        return;
    }

    let puntajeGato = calcularPuntaje(manoGato);

    while (puntajeGato < 17) {
        manoGato.push(mazo.pop());
        puntajeGato = calcularPuntaje(manoGato);
    }

    actualizarInterfaz();

    if (puntajeGato > 21) {
        terminarRonda("El Gato se pasó de 21. ¡Ganaste!");
    } else if (puntajeGato > puntajeJugador) {
        terminarRonda("El Gato Villano ganó esta mano.");
    } else if (puntajeGato < puntajeJugador) {
        terminarRonda("¡Ganaste la mano!");
    } else {
        terminarRonda("Empate.");
    }
}

/* ========================================
   EVENTOS
   ======================================== */

btnRepartir.addEventListener("click", repartir);
btnPedir.addEventListener("click", pedirCarta);
btnPlantarse.addEventListener("click", plantarse);
btnNuevaPartida.addEventListener("click", repartir);