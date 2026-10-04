# Trabajo Práctico 1 — Informática General

## Descripción del proyecto

Trabajo Práctico 1 de Informática General, carrera de Artes Multimediales (UNA). Consiste en un sitio web con tres juegos (cartas, dados y preguntas), desarrollado con HTML, CSS y JavaScript, aplicando los contenidos vistos durante la cursada.

**Integrantes:** Andrés Ruarte y Rocío Sosa.

---

## Primera etapa: estructura y layout

Se definió en conjunto la estructura general del sitio a partir de la página principal (`index.html`), organizada con: barra de navegación, sección de información general, sección de presentación de los tres juegos (con sus imágenes funcionando como enlaces), y pie de página con los datos de la materia y acceso a "Nosotros".

La sección "Nosotros" fue desarrollada por Rocío. La estética visual se fue definiendo y ajustando a lo largo del trabajo.

---

## Dirección artística y visual

La identidad visual del sitio estuvo a cargo de Rocío, quien propuso la estética **pixel art** como línea gráfica del proyecto. Esto se refleja en:

- Los gifs animados del Gato Villano (pensando, diciendo "par", diciendo "impar"), creados con esta estética.
- La tipografía "Press Start 2P" (estilo retro, tipo consola de 8 bits), usada en títulos y elementos destacados.

Buscamos reforzar una tematica "arcade" del sitio, en línea con el personaje del Gato Villano (Miauley). El resto del contenido (textos de cuerpo, reglas, formularios) usa tipografías más legibles (Crimson Text, Roboto, Titillium Web, Ubuntu), para que el estilo retro no afecte la comprensión de las instrucciones de cada juego.

---

## Descripción y reglas de cada juego

### Blackjack (Cartas)

El objetivo es acercarse lo más posible a 21 sin pasarse, jugando contra el Gato Villano, que representa a la banca.

Al repartir, ambos reciben dos cartas; la segunda carta del Gato queda oculta hasta que el jugador termina su turno. El jugador puede pedir carta las veces que quiera o plantarse. Si se pasa de 21, pierde automáticamente.

Al plantarse, el Gato pide carta mientras su puntaje sea menor a 17 (regla fija de la banca). Gana quien quede más cerca de 21 sin pasarse. Las figuras valen 10, y el As vale 11 o 1 según convenga.

### Dados (Par o Impar)

Se juegan 5 rondas alternadas contra el Gato Villano.

Cuando tira el jugador, el resultado se calcula al instante pero se mantiene oculto mientras el Gato "piensa" y anuncia si cree que es par o impar; recién después se revela el resultado real. Si el Gato falla, el jugador gana la ronda.

Cuando tira el Gato, el jugador elige "Par" o "Impar" antes de conocer el resultado. Si acierta, gana la ronda.

El avance entre etapas (tirar, ver la decisión del Gato, revelar el resultado, siguiente ronda) se maneja con un botón "Continuar", para que sea el usuario quien controle el ritmo del juego en vez de depender de tiempos de espera fijos.

### Preguntas (Trivia)

Partida de 10 preguntas de opción múltiple, obtenidas de la API pública Open Trivia Database (OpenTDB). El jugador elige la categoría antes de empezar.

Cada pregunta tiene un límite de 20 segundos, visible con una barra de tiempo. Si se agota sin responder, cuenta como error y se avanza automáticamente. Cada acierto suma 1 punto. Al terminar, se muestra un resumen con la cantidad de aciertos.

---

## Tecnologías utilizadas

- **HTML5**, con elementos semánticos (`header`, `nav`, `main`, `section`, `article`, `footer`, `table`).
- **CSS3**, con una única hoja de estilos externa, usando Google Fonts para la tipografía.
- **JavaScript** (vanilla, sin frameworks ni librerías), para toda la lógica de los juegos.
- **Fetch API**, para consumir la API pública de preguntas.
- **localStorage**, para el nombre del jugador y los puntajes acumulados de cada juego.

---

## Descripción de las principales funcionalidades

- **Nombre de jugador:** se pide una sola vez con `prompt`, la primera vez que se visita el sitio, y queda guardado en `localStorage` para no repetir la pregunta en próximas visitas.
- **Puntaje unificado:** los tres juegos suman 1 punto por acierto a un contador propio en `localStorage`, acumulado permanentemente y mostrado en conjunto en `puntajes.html`.
- **Contenido dinámico:** las cartas del mazo, las imágenes de los dados y las preguntas de la trivia se generan y actualizan por JavaScript, sin elementos fijos en el HTML.
- **Temporizador:** el juego de Preguntas limita el tiempo de respuesta por pregunta con `setInterval`.
- **Consumo de API:** el juego de Preguntas usa `fetch` para pedir los datos a OpenTDB, maneja errores posibles (sin conexión, categoría sin preguntas suficientes) y decodifica el texto recibido (entidades HTML).

---

## API utilizada

Se utilizó **Open Trivia Database (OpenTDB)** — `https://opentdb.com/api.php` — para el juego de Preguntas.

**Información que se obtiene:** un array de 10 preguntas de opción múltiple, cada una con su categoría, respuesta correcta y un array de respuestas incorrectas.

**Cómo se consulta:** con `fetch()`, armando la URL dinámicamente con la cantidad de preguntas, la categoría elegida, la dificultad y el tipo como parámetros (`amount`, `category`, `difficulty`, `type`).

**Datos recibidos:** un JSON con `response_code` (indica si la consulta salió bien) y un array `results` con las preguntas.

**Procesamiento:** el texto llega con entidades HTML (por ejemplo `&quot;`), por lo que se decodifica antes de mostrarse. Las 4 opciones (correcta + 3 incorrectas) se combinan en un array y se mezclan al azar, para que la correcta no quede siempre en la misma posición.

---

## Principales decisiones técnicas

- **Puntaje simple en vez de ranking con nombres:** cada juego suma 1 punto por acierto a un contador en `localStorage`, en vez de una tabla de posiciones con nombres. `localStorage` es local a cada navegador.
- **Avance por botones en vez de temporizadores en Dados:** las etapas de cada ronda avanzaban al principio con `setTimeout` encadenados. Se cambió a un botón "Continuar" para que el usuario controle el ritmo, evitando esperas confusas.
- **Ocultar resultados cambiando la imagen, no con `hidden`:** para ocultar la segunda carta del Gato o los dados antes de revelarse, se optó por cambiar el `src` a una versión "oculta" en vez de usar el atributo `hidden` sobre el contenedor, porque el CSS (`display: flex`) pisaba esa propiedad.
- **Estética pixel art como línea gráfica:** decisión de Rocío, aplicada a los gifs del Gato Villano y a la tipografía de títulos, reforzando la identidad arcade sin afectar la legibilidad de las reglas (ver "Dirección artística y visual").

---

## Uso de Inteligencia Artificial

Se utilizó **Claude (Anthropic)** como herramienta de apoyo en distintas etapas del desarrollo.

**Etapas en las que se usó:**

- Resolución de conflictos.
- Diseño y programación de la lógica de los tres juegos.
- Implementación del sistema de puntajes con `localStorage`.
- Mejoras de experiencia de usuario (pausas narrativas, botones de avance).
- Corrección de bugs puntuales (por ejemplo, un problema de CSS que impedía ocultar correctamente los dados).

**Principales usos y ejemplos de aportes:**

- Generación de una primera versión funcional de cada juego, a partir de reglas definidas por el grupo, ajustada después en conjunto.
- Ajustes en el codigo para entenderlo mejor y que sea mas legible (por ej: eliminar constantes de configuración que no se entendian).
- Explicaciones función por función de la lógica de cada juego (el algoritmo de mezcla de cartas, el cálculo del puntaje con As, el sistema de turnos en Dados), usadas como repaso para la defensa.

**Modificaciones y decisiones del grupo sobre las propuestas:**

- Se descartó una primera propuesta de login/nombre con formulario en pantalla, a favor de un `prompt()` simple, más fácil de explicar y defender individualmente.
- Se simplificó el sistema de puntaje de Preguntas (que originalmente calculaba un puntaje con bonus por tiempo de respuesta) a "+1 por acierto", igual al de los otros dos juegos, para mantener consistencia entre los tres.
- Se ajustaron manualmente tiempos de espera, textos de la interfaz y nombres de variables, para que el código se sintiera propio y lo podamos entender y explicar correctamente.
- La dirección artística y visual (estética pixel art, diseño de los gifs del Gato Villano) fue una decisión y un desarrollo propio de Rocío, no generado por IA.
