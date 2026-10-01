// Config del juego
const totalRondas = 5;
let rondaActual = 1;
let puntosPartida = 0;
let turnoActual = "jugador";
let eleccionUsuario = null;
let bloqueado = false;

const infoRonda = document.getElementById("info-ronda");
const puntosPartidaTexto = document.getElementById("puntos-partida");
const mensajeEstadoDados = document.getElementById("mensaje-estado-dados");
const gifGato = document.getElementById("gif-gato-pensando");

const dado1 = document.getElementById("dado-1");
const dado2 = document.getElementById("dado-2");
const contenedorDados = document.getElementById("contenedor-dados");


const controlesJugador = document.getElementById("controles-jugador");
const btnTirarJugador = document.getElementById("btn-tirar-jugador");
const controlesEleccion = document.getElementById("controles-eleccion");
const btnElegirPar = document.getElementById("btn-elegir-par");
const btnElegirImpar = document.getElementById("btn-elegir-impar");
const btnNuevaPartidaDados = document.getElementById("btn-nueva-partida-dados");


function tirarDado() {
    return Math.floor(Math.random() * 6) + 1;
}

function mostrarDados(dado1Valor, dado2Valor) {
    dado1.src = "img/dados/dado_" + dado1Valor + ".png";
    dado2.src = "img/dados/dado_" + dado2Valor + ".png";
}

function ocultarDados() {
    dado1.src = "img/dados/dado_oculto.png";
    dado2.src = "img/dados/dado_oculto.png";
}


function animarDados(cuandoTermine) {
    let vueltas = 0;
    const intervalo = setInterval(function () {
        dado1.src = "img/dados/dado_" + tirarDado() + ".png";
        dado2.src = "img/dados/dado_" + tirarDado() + ".png";
        vueltas++;

        if (vueltas >= 35) {
            clearInterval(intervalo);
            cuandoTermine();
        }
    }, 100);
}


function iniciarTurnoJugador() {
    turnoActual = "jugador";
    mensajeEstadoDados.textContent = "Presioná \"Tirar dados\" para tirar.";
    mostrarDados(tirarDado(), tirarDado());

    controlesJugador.hidden = false;
    controlesEleccion.hidden = true;
    btnTirarJugador.disabled = false;
}

function tirarDadosJugador() {
    if (bloqueado) return;

    bloqueado = true;
    btnTirarJugador.disabled = true;

    const dado1Valor = tirarDado();
    const dado2Valor = tirarDado();
    const suma = dado1Valor + dado2Valor;
    const esPar = suma % 2 === 0;

    mensajeEstadoDados.textContent = "Tirando los dados...";

    animarDados(function () {
        ocultarDados();
        gifGato.src = "img/gatodados.jpg";
        gifGato.hidden = false;
        mensajeEstadoDados.textContent = "El Gato Villano está pensando...";

        setTimeout(function () {
            // 50% de que el gato acierte. Si acierta, "dice" lo mismo que salió.
            const gatoAcierta = Math.random() < 0.5;
            const dijoPar = gatoAcierta ? esPar : !esPar;

            gifGato.src = dijoPar ? "img/gatopar.jpg" : "img/gatoimpar.jpg";
            mensajeEstadoDados.textContent = "El Gato Villano dice: " + (dijoPar ? "Par" : "Impar") + "...";

            setTimeout(function () {
                gifGato.hidden = true;
                mostrarDados(dado1Valor, dado2Valor);

                let mensaje = "Sacaste " + dado1Valor + " y " + dado2Valor + " (" + (esPar ? "Par" : "Impar") + "). ";

                if (gatoAcierta) {
                    mensaje += "El Gato Villano adivinó. Perdiste esta ronda.";
                } else {
                    mensaje += "¡El Gato Villano falló! Ganaste esta ronda.";
                    sumarPunto();
                }

                mensajeEstadoDados.textContent = mensaje;
                bloqueado = false;
                setTimeout(avanzarRonda, 8500);

            }, 7500);
        }, 7000);
    });
}


function iniciarTurnoGato() {
    turnoActual = "gato";
    eleccionUsuario = null;
    mensajeEstadoDados.textContent = "El Gato Villano va a tirar. Elegí Par o Impar.";
    mostrarDados(tirarDado(), tirarDado());

    controlesJugador.hidden = true;
    controlesEleccion.hidden = false;
}

function elegirParImpar(eleccion) {
    if (bloqueado) return;

    bloqueado = true;
    eleccionUsuario = eleccion;
    controlesEleccion.hidden = true;

    const dado1Valor = tirarDado();
    const dado2Valor = tirarDado();
    const suma = dado1Valor + dado2Valor;

    mensajeEstadoDados.textContent = "El Gato Villano está tirando...";

    animarDados(function () {
        mostrarDados(dado1Valor, dado2Valor);

        const resultadoReal = suma % 2 === 0 ? "par" : "impar";
        let mensaje = "El Gato Villano sacó " + dado1Valor + " y " + dado2Valor + " (" + (suma % 2 === 0 ? "Par" : "Impar") + "). ";

        if (eleccionUsuario === resultadoReal) {
            mensaje += "¡Acertaste! Ganaste esta ronda.";
            sumarPunto();
        } else {
            mensaje += "Fallaste esta ronda.";
        }

        mensajeEstadoDados.textContent = mensaje;
        bloqueado = false;
        setTimeout(avanzarRonda, 7500);
    });
}


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


btnTirarJugador.addEventListener("click", tirarDadosJugador);
btnElegirPar.addEventListener("click", function () { elegirParImpar("par"); });
btnElegirImpar.addEventListener("click", function () { elegirParImpar("impar"); });
btnNuevaPartidaDados.addEventListener("click", nuevaPartidaDados);

iniciarTurnoJugador();