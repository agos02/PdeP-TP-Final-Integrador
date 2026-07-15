import promptSync from "prompt-sync";
import { GestorTareas } from "../services/GestorTareas";
import { Tarea } from "../models/Tarea";

const prompt = promptSync();

// Instanciamos el Gestor central de forma encapsulada para evitar globales.
const gestor = new GestorTareas();


//MÓDULOS DE VALIDACIÓN (PE: Único propósito)


//Solicita de forma interactiva el título de la tarea obligando a que no esté vacío.

function solicitarTitulo(): string {
  while (true) {
    const titulo = (prompt("Ingresa el título: ") || "").trim();
    if (titulo !== "") {
      return titulo;
    }
    console.log("Error: El título no puede quedar vacío. Intenta de nuevo.");
  }
}

// Solicita y normaliza el estado de la tarea verificando opciones permitidas.

function solicitarEstado(): string {
  const estadosValidos = ["pendiente", "en curso", "terminada"];
  while (true) {
    const estado = (prompt("Ingresa el estado (En curso, Pendiente, Terminada): ") || "")
      .trim()
      .toLowerCase();
    
    if (estadosValidos.includes(estado)) {
      if (estado === "pendiente") return "Pendiente";
      if (estado === "en curso") return "En curso";
      if (estado === "terminada") return "Terminada";
    }
    console.log("Error: Estado no válido. Escribe 'Pendiente', 'En curso' o 'Terminada'.");
  }
}

//Solicita y valida que la fecha de vencimiento cumpla con un formato de fecha real.

function solicitarVencimiento(): string {
  while (true) {
    const vencimiento = (prompt("Ingresa la fecha de vencimiento (AAAA-MM-DD, opcional): ") || "").trim();
    if (vencimiento === "") {
      return "Sin fecha";
    }
    const fechaPrueba = new Date(vencimiento);
    if (!isNaN(fechaPrueba.getTime())) {
      return vencimiento;
    }
    console.log("Error: Fecha inválida. Escribe un formato real como AAAA-MM-DD (ej: 2026-12-31).");
  }
}

//Solicita y valida el nivel de dificultad asignado a la tarea.

function solicitarDificultad(): string {
  const dificultadesValidas = ["fácil", "facil", "medio", "difícil", "dificil"];
  while (true) {
    const dificultad = (prompt("Ingresa la dificultad (fácil, medio, difícil): ") || "")
      .trim()
      .toLowerCase();

    if (dificultadesValidas.includes(dificultad)) {
      if (dificultad === "facil" || dificultad === "fácil") return "Fácil";
      if (dificultad === "medio") return "Medio";
      if (dificultad === "dificil" || dificultad === "difícil") return "Difícil";
    }
    console.log("Error: Dificultad no válida. Escribe 'fácil', 'medio' o 'difícil'.");
  }
}

//Procedimiento encargado de imprimir de manera prolija una tarea.
 
function mostrarTareaEstilizada(tarea: Tarea): void {
  console.log(`\n--- Tarea ID: ${tarea.id} ---`);
  console.log(`Título: ${tarea.titulo}`);
  console.log(`Descripción: ${tarea.descripcion}`);
  console.log(`Estado: ${tarea.estado}`);
  console.log(`Dificultad: ${tarea.dificultad}`);
  console.log(`Fecha de Creación: ${tarea.fechaCreacion}`);
  console.log(`Fecha de Vencimiento: ${tarea.fechaVencimiento}`);
}

// ==========================================
//          ACCIONES DEL MENÚ PRINCIPAL
// ==========================================

//Maneja el submenú de visualización y filtrado de tareas.

function verTareas(): void {
  console.clear();
  console.log("¿Qué tarea deseas ver?");
  console.log("1.Todas");
  console.log("2.Pendientes");
  console.log("3.Terminadas");
  console.log("4.En Curso");
  console.log("5.Volver");
  const subOpcion = prompt("Elige una opción: ") || "";

  let tareasFiltradas: Tarea[] = [];

  switch (subOpcion) {
    case "1":
      tareasFiltradas = gestor.obtenerTodas();
      break;
    case "2":
      tareasFiltradas = gestor.filtrarPorEstado("Pendiente");
      break;
    case "3":
      tareasFiltradas = gestor.filtrarPorEstado("Terminada");
      break;
    case "4":
      tareasFiltradas = gestor.filtrarPorEstado("En curso");
      break;
    case "5":
      return;
    default:
      console.log("Opción no válida.");
      prompt("\nPresiona Enter para continuar...");
      return;
  }

  console.clear();
  if (tareasFiltradas.length === 0) {
    console.log("No hay tareas para mostrar en esta categoría.");
  } else {
    // PF: Uso de función de orden superior para iterar de manera declarativa
    tareasFiltradas.forEach(mostrarTareaEstilizada);
  }

  prompt("\nPresiona Enter para continuar...");
}

// Solicita un término de búsqueda y ejecuta el algoritmo recursivo del gestor.

function buscarTarea(): void {
  console.clear();
  console.log("--- Búsqueda de Tarea (Lógica Recursiva) ---");
  const termino = prompt("Ingresa el título, descripción o estado de la tarea a buscar: ") || "";

  // Ejecuta la búsqueda de forma lógica recursiva
  const resultados = gestor.buscarRecursivo(termino);

  if (resultados.length === 0) {
    console.log(`\nNo se encontraron tareas que coincidan con: "${termino}"`);
  } else {
    console.log(`\nSe encontraron ${resultados.length} coincidencia(s):`);
    resultados.forEach(mostrarTareaEstilizada);
  }

  prompt("\nPresiona Enter para continuar...");
}

//Consulta de detalles interactivos ingresando texto libre.

function mostrarDetalles(): void {
  console.clear();
  const estadoBuscado = prompt("Ingresa el estado de la tarea que quieres ver (Pendiente, Terminada, En Curso, Todas): ") || "";
  
  let tareasFiltradas: Tarea[] = [];
  if (estadoBuscado.toLowerCase() === "todas") {
    tareasFiltradas = gestor.obtenerTodas();
  } else {
    tareasFiltradas = gestor.filtrarPorEstado(estadoBuscado);
  }

  console.clear();
  if (tareasFiltradas.length === 0) {
    console.log(`No hay tareas que coincidan con el estado "${estadoBuscado}".`);
  } else {
    tareasFiltradas.forEach(mostrarTareaEstilizada);
  }

  prompt("\nPresiona Enter para continuar...");
}

/**
 * Solicita el ID de una tarea y la elimina del sistema.
 * Si existe, también se actualiza automáticamente el archivo tareas.json.
 */
function eliminarTarea(): void {
  console.clear();
  console.log("--- Eliminar Tarea ---");

  const id = Number(prompt("Ingresa el ID de la tarea que deseas eliminar: "));

  if (isNaN(id)) {
    console.log("\nError: Debes ingresar un número válido.");
    prompt("Presiona Enter para continuar...");
    return;
  }

  const eliminada = gestor.eliminarTarea(id);

  if (eliminada) {
    console.log("\nTarea eliminada correctamente.");
  } else {
    console.log("\nNo existe una tarea con ese ID.");
  }

  prompt("\nPresiona Enter para continuar...");
}


// Permite visualizar las tareas ordenadas según el criterio elegido por el usuario.
function ordenarTareas(): void {

  console.clear();
  console.log("--- Ordenar Tareas ---");
  console.log("1. Ordenar por título");
  console.log("2. Ordenar por fecha de vencimiento");
  console.log("3. Ordenar por fecha de creación"); 
  console.log("4. Ordenar por dificultad");         
  console.log("5. Volver");

  const opcion = prompt("Selecciona una opción: ") || "";

  let tareasOrdenadas: Tarea[] = [];

  switch (opcion) {

    case "1":
      tareasOrdenadas = gestor.ordenarPorTitulo();
      break;

    case "2":
      tareasOrdenadas = gestor.ordenarPorFechaVencimiento();
      break;

    case "3":
        tareasOrdenadas = gestor.ordenarPorFechaCreacion(); // Nueva llamada al gestor
      break;

    case "4":
        tareasOrdenadas = gestor.ordenarPorDificultad();
      break;

    case "5":
      return;

    default:
      console.log("Opción no válida.");
      prompt("\nPresiona Enter para continuar...");
      return;
  }

  console.clear();

  if (tareasOrdenadas.length === 0) {
    console.log("No hay tareas para mostrar.");
  } else {
    tareasOrdenadas.forEach(mostrarTareaEstilizada);
  }

  prompt("\nPresiona Enter para continuar...");
}

// Bucle principal de ejecución del Menú por consola.
export function iniciarMenu(): void {
  let opcion: string = "";
  do {
    console.clear();
    console.log("Bienvenido!\n");
    console.log("¿Qué deseas hacer?");
    console.log("1.Ver mis tareas");
    console.log("2.Buscar tarea");
    console.log("3.Agregar tarea");
    console.log("4.Ver Detalles de Tareas");
    console.log("5.Eliminar tarea");
    console.log("6.Ordenar tareas");
    console.log("7.Salir");

    opcion = prompt("Elige una opción: ") || "";

    switch (opcion) {
      case "1":
        verTareas();
        break;

      case "2":
        buscarTarea();
        break;

      case "3":
        console.clear();
        console.log("--- Agregar Nueva Tarea ---");
        const titulo = solicitarTitulo();
        const descripcion = prompt("Ingresa la descripción: ") || "";
        const estado = solicitarEstado();
        const dificultad = solicitarDificultad();
        const vencimiento = solicitarVencimiento();

        gestor.agregarTarea(titulo, descripcion, estado, dificultad, vencimiento);
        
        console.log("\n¡Tarea agregada con éxito!");
        prompt("Presiona Enter para continuar...");
        break;
      
      case "4":
        mostrarDetalles(); 
        break;

      case "5":
        eliminarTarea(); 
        break;

      case "6":
        ordenarTareas();
        break;

      case "7":
        console.log("\n¡Saliendo de la aplicación! Que tengas un gran día.");
        break;

      default:
        console.log("Opción no válida. Intenta de nuevo.");
        prompt("Presiona Enter para continuar...");
        break;
    }
  } while (opcion !== "7");
}