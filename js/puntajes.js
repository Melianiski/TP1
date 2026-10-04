const nombreJugador = localStorage.getItem("nombreJugador") || "Invitado";

const puntosCartas = Number(localStorage.getItem("puntosCartas")) || 0;
const puntosDados = Number(localStorage.getItem("puntosDados")) || 0;
const puntosPreguntas = Number(localStorage.getItem("puntosPreguntas")) || 0;

const jugadores = [
    {
        nombre: nombreJugador,
        cartas: puntosCartas,
        dados: puntosDados,
        preguntas: puntosPreguntas
    },
    {
        nombre: "Miauley",
        cartas: 1337,
        dados: 1337,
        preguntas: 1337
    },
    {
        nombre: "Michineitor",
        cartas: 6,
        dados: 8,
        preguntas: 14
    },
    {
        nombre: "FelipeMcFly",
        cartas: 1,
        dados: 2,
        preguntas: 200
    },
    {
        nombre: "Rocíocaster",
        cartas: 120,
        dados: 150,
        preguntas: 90
    },
    {
        nombre: "Andres",
        cartas: 115,
        dados: 140,
        preguntas: 85
    },
     {
        nombre: "gUMER",
        cartas: 50,
        dados: 20,
        preguntas: 680
    },
     {
        nombre: "zakk",
        cartas: 25,
        dados: 11,
        preguntas: 23
    },
    {
        nombre: "m3114n15k1",
        cartas: 11,
        dados: 2,
        preguntas: 41
    },
    {
        nombre: "hatzive",
        cartas: 41,
        dados: 33,
        preguntas: 1
    },
    {
        nombre: "knnv",
        cartas: 7,
        dados: 7,
        preguntas: 7
    }
];

for (let i = 0; i < jugadores.length; i++) {
    jugadores[i].total =
        jugadores[i].cartas +
        jugadores[i].dados +
        jugadores[i].preguntas;
}

jugadores.sort(function(a, b) { // ordena el array segun el total
    return b.total - a.total;
});

const tabla = document.getElementById("tabla-jugadores");

for (let i = 0; i < jugadores.length; i++) {

    const jugador = jugadores[i];
    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${jugador.nombre}</td>
        <td>${jugador.cartas}</td>
        <td>${jugador.dados}</td>
        <td>${jugador.preguntas}</td>
        <td>${jugador.total}</td>
    `;

    tabla.appendChild(fila);
}