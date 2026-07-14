"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)();
// Creamos un arreglo (array) para guardar como maximo 10 tareas.
// Cada elemento será un objeto con la estructura de la interfaz Tarea.
let tareas = new Array(10);
// Variable que lleva la cuenta de cuántas tareas se han agregado.
let numTareas = 0;
// Variable que guarda la opción que el usuario elige del menú.
let opcion = "";
do {
    console.clear(); // Limpia la consola antes de mostrar el menú.
    console.log("Bienvenido!\n");
    console.log("¿Qué deseas hacer?");
    console.log("1.Ver mis tareas");
    console.log("2.Buscar tarea");
    console.log("3.Agregar tarea");
    console.log("4.Ver Detalles de Tareas");
    console.log("5.Salir\n");
    // Pide al usuario que elija una opción.
    opcion = prompt("Elige una opción: ") || "";
    // Estructura switch: ejecuta una parte del código según la opción elegida.
    switch (opcion) {
        case "1":
            verTareas(); // Llama a la función para ver tareas.
            break;
        case "2":
            buscarTarea(); // Llama a la función para buscar tareas.
            break;
        case "3":
            // Verifica si hay espacio en el array para agregar una nueva tarea.
            if (numTareas < tareas.length) {
                // Pide los datos al usuario.
                let titulo = prompt("Ingresa el título: ") || "";
                let descripcion = prompt("Ingresa la descripción: ") || "";
                let estado = prompt("Ingresa el estado (En curso, Pendiente, Terminada): ") || "";
                let vencimiento = prompt("Ingresa la fecha de vencimiento (opcional): ") || "";
                let dificultad = prompt("Ingresa la dificultad (fácil, medio, difícil): ") || "";
                // Crea un objeto Tarea con los datos ingresados.
                const nuevaTarea = {
                    titulo: titulo,
                    descripcion: descripcion,
                    estado: estado,
                    fechaCreacion: new Date().toLocaleString(),
                    fechaVencimiento: vencimiento,
                    dificultad: dificultad,
                };
                // Guarda la tarea en el array en la posición correspondiente.
                tareas[numTareas] = nuevaTarea;
                numTareas++; // Incrementa el contador de tareas.
                console.log("\n¡Tarea agregada con éxito!");
            }
            else {
                console.log("\n¡No se pueden agregar más tareas! El espacio está lleno.");
            }
            prompt("Presiona Enter para continuar...");
            break;
        case "4":
            mostrarDetalles(); // Llama a la función que muestra tareas por estado.
            break;
        case "5":
            console.log("Salir"); // Finaliza el programa.
            break;
        default:
            console.log("Opción no válida. Intenta de nuevo.");
            prompt("Presiona Enter para continuar...");
            break;
    }
} while (opcion !== "5");
// --- FUNCIÓN VER TAREAS ---
// Muestra una lista de tareas filtrada por estado o todas.
function verTareas() {
    console.clear(); // Limpia la consola al entrar a esta función
    let subOpcion;
    // Muestra un submenú para que el usuario elija qué tipo de tareas ver
    console.log("¿Qué tarea deseas ver?");
    console.log("1.Todas");
    console.log("2.Pendientes");
    console.log("3.Terminadas");
    console.log("4.En Curso");
    console.log("5.Volver");
    subOpcion = prompt("Elige una opción: ") || "";
    // Pide al usuario que ingrese la opción deseada.
    // Si no ingresa nada, se guarda una cadena vacía "".
    switch (subOpcion) {
        case "1":
            console.clear();
            console.log("Todas tus tareas:");
            if (numTareas === 0) {
                console.log("No tienes tareas agregadas.");
            }
            else { // Recorre todas las tareas y las muestra
                for (let i = 0; i < numTareas; i++) {
                    const tareaActual = tareas[i]; // Guarda la tarea actual en una variable para usarla más fácilmente.
                    console.log("\n--- Tarea " + (i + 1) + " ---");
                    // Muestra un separador con el número de tarea.
                    console.log("Título: " + tareaActual.titulo);
                    console.log("Descripción: " + tareaActual.descripcion);
                    console.log("Estado: " + tareaActual.estado);
                    console.log("Dificultad: " + tareaActual.dificultad);
                    console.log("Fecha de Creación: " + tareaActual.fechaCreacion);
                    console.log("Fecha de Vencimiento: " + tareaActual.fechaVencimiento);
                    // Muestra todos los detalles de la tarea.
                }
            }
            break;
        case "2":
            console.clear(); // Solo muestra las tareas cuyo estado es "Pendiente"
            console.log("Tus tareas pendientes:");
            let contadorPendientes = 0;
            // Contador para saber cuántas tareas cumplen la condición.
            for (let i = 0; i < numTareas; i++) {
                const tareaActual = tareas[i];
                if (tareaActual.estado && tareaActual.estado.toLowerCase() === "pendiente") { // Solo muestra las tareas cuyo estado es "Pendiente", ignorando mayúsculas/minúsculas.
                    console.log("\n--- Tarea " + (i + 1) + " ---");
                    console.log("Título: " + tareaActual.titulo);
                    console.log("Estado: " + tareaActual.estado);
                    contadorPendientes++;
                }
            }
            if (contadorPendientes === 0) {
                console.log("No tienes tareas pendientes.");
            }
            break;
        case "3":
            console.clear();
            console.log("Tareas terminadas:");
            let contadorTerminadas = 0;
            for (let i = 0; i < numTareas; i++) {
                const tareaActual = tareas[i];
                if (tareaActual.estado && tareaActual.estado.toLowerCase() === "terminada") {
                    // Filtra tareas terminadas
                    console.log("\n--- Tarea " + (i + 1) + " ---");
                    console.log("Título: " + tareaActual.titulo);
                    console.log("Estado: " + tareaActual.estado);
                    contadorTerminadas++;
                }
            }
            if (contadorTerminadas === 0) {
                console.log("No hay tareas terminadas.");
            }
            break;
        case "4":
            console.clear();
            console.log("Tus tareas en curso:");
            let contadorEnCurso = 0;
            for (let i = 0; i < numTareas; i++) {
                const tareaActual = tareas[i];
                if (tareaActual.estado && tareaActual.estado.toLowerCase() === "en curso") {
                    // Filtra tareas en curso
                    console.log("\n--- Tarea " + (i + 1) + " ---");
                    console.log("Título: " + tareaActual.titulo);
                    console.log("Estado: " + tareaActual.estado);
                    contadorEnCurso++;
                }
            }
            if (contadorEnCurso === 0) {
                console.log("No tienes tareas en curso.");
            }
            break;
        case "5":
            console.log("Volviendo...");
            // Opción para volver al menú principal sin mostrar nada.
            break;
        default:
            console.log("Opción no válida.");
            // Si el usuario ingresa cualquier otra cosa.
            break;
    }
    prompt("\nPresiona Enter para continuar...");
    // Pausa para que el usuario pueda leer la información antes de limpiar la consola.
}
// --- FUNCIÓN MOSTRAR DETALLES ---
// Muestra todas las tareas o las que tienen un estado específico.
function mostrarDetalles() {
    console.clear();
    // Limpia la consola al ingresar a la función
    let estadoBuscado = prompt("Ingresa el estado de la tarea que quieres ver (Pendiente, Terminada, En Curso, Todas): ") || "";
    // Pide al usuario el estado de las tareas que desea ver.
    let contador = 0;
    // Contador de tareas encontradas
    console.log("\nMostrando detalles de tareas: " + estadoBuscado);
    if (estadoBuscado.toLowerCase() === "todas") {
        // Muestra todas las tareas
        for (let i = 0; i < numTareas; i++) {
            const tareaActual = tareas[i];
            console.log("\n--- Tarea " + (i + 1) + " ---");
            console.log("Título: " + tareaActual.titulo);
            console.log("Descripción: " + tareaActual.descripcion);
            console.log("Estado: " + tareaActual.estado);
            console.log("Dificultad: " + tareaActual.dificultad);
            console.log("Fecha de Creación: " + tareaActual.fechaCreacion);
            console.log("Fecha de Vencimiento: " + tareaActual.fechaVencimiento);
            contador++;
        }
    }
    else {
        // Muestra solo las tareas del estado ingresado
        for (let i = 0; i < numTareas; i++) {
            const tareaActual = tareas[i];
            if (tareaActual.estado.toLowerCase() === estadoBuscado.toLowerCase()) {
                console.log("\n--- Tarea " + (i + 1) + " ---");
                console.log("Título: " + tareaActual.titulo);
                console.log("Descripción: " + tareaActual.descripcion);
                console.log("Estado: " + tareaActual.estado);
                console.log("Dificultad: " + tareaActual.dificultad);
                console.log("Fecha de Creación: " + tareaActual.fechaCreacion);
                console.log("Fecha de Vencimiento: " + tareaActual.fechaVencimiento);
                contador++;
            }
        }
    }
    if (contador === 0) {
        console.log("No hay tareas con ese estado.");
    }
    prompt("\nPresiona Enter para continuar...");
}
// --- FUNCIÓN BUSCAR TAREAS ---
// Permite al usuario buscar una tarea por una palabra en el título, descripción o estado.
function buscarTarea() {
    console.clear();
    // Limpia la consola al ingresar
    console.log("--- Búsqueda de Tarea ---");
    let terminoBusqueda = prompt("Ingresa el título, descripción o estado de la tarea a buscar: ") || "";
    // Pide al usuario una palabra o frase para buscar en las tareas
    let terminoMinusc = terminoBusqueda.toLowerCase();
    // Convierte el término a minúsculas para comparar sin importar mayúsculas/minúsculas
    let contadorResultados = 0;
    // Contador de cuántas tareas coinciden con la búsqueda
    for (let i = 0; i < numTareas; i++) {
        const tareaActual = tareas[i];
        // Guarda la tarea actual en una variable temporal
        if (tareaActual.titulo.toLowerCase().includes(terminoMinusc) ||
            tareaActual.descripcion.toLowerCase().includes(terminoMinusc) ||
            tareaActual.estado.toLowerCase().includes(terminoMinusc)) {
            // Verifica si el término de búsqueda está en título, descripción o estado
            console.log("\n--- Coincidencia Encontrada (Tarea " + (i + 1) + ") ---");
            console.log("Título: " + tareaActual.titulo);
            console.log("Descripción: " + tareaActual.descripcion);
            console.log("Estado: " + tareaActual.estado);
            console.log("Dificulnpx tscad: " + tareaActual.dificultad);
            console.log("Fecha de Creación: " + tareaActual.fechaCreacion);
            console.log("Fecha de Vencimiento: " + tareaActual.fechaVencimiento);
            contadorResultados++;
            // Aumenta el contador de coincidencias encontradas
        }
    }
    if (contadorResultados === 0) {
        // Si no se encontró ninguna coincidencia
        console.log("\nNo se encontraron tareas que coincidan con: " + terminoBusqueda);
    }
    prompt("\nPresiona Enter para continuar...");
    // Pausa para que el usuario lea los resultados
}
