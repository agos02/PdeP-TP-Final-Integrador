import promptSync from "prompt-sync";
import { GestorTareas } from "../services/GestorTareas";
import { Tarea } from "../models/Tarea";
import { solicitarTitulo, solicitarEstado, solicitarDificultad, solicitarVencimiento } from "./Validaciones";
import { limpiarPantalla, mostrarTareaEstilizada, mostrarLista, pausar } from "./Consola";

const prompt = promptSync();
// Instanciamos el Gestor central de forma encapsulada para evitar globales.
const gestor = new GestorTareas();

// ==========================================
// FUNCIONES DE VISUALIZACIÓN
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

  limpiarPantalla();
  mostrarLista(tareasFiltradas);
  pausar();
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

  pausar();
}

// ==========================================
// ACCIONES SOBRE TAREAS
// ==========================================

// Solicita un término de búsqueda y ejecuta el algoritmo recursivo del gestor.
function buscarTarea(): void {
  console.clear();
  console.log("--- Búsqueda de Tarea ---"); //(Lógica Recursiva)


  const termino = prompt("Ingresa el título, descripción o estado de la tarea a buscar: ") || "";

  // Ejecuta la búsqueda de forma lógica recursiva
  const resultados = gestor.buscarRecursivo(termino);

  if (resultados.length === 0) {
    console.log(`\nNo se encontraron tareas que coincidan con: "${termino}"`);
  } else {
    console.log(`\nSe encontraron ${resultados.length} coincidencia(s):`);
    resultados.forEach(mostrarTareaEstilizada);
  }

  pausar();
}

// Solicita el ID de la tarea a eliminar y llama al gestor para realizar la acción.
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

  pausar();
}

// Permite visualizar las tareas ordenadas según el criterio elegido por el usuario.
function ordenarTareas(): void {

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
      pausar();
      return;
  }

  console.clear();

  if (tareasOrdenadas.length === 0) {
    console.log("No hay tareas para mostrar.");
  } else {
    tareasOrdenadas.forEach(mostrarTareaEstilizada);
  }

  pausar();
}

// ==========================================
// ESTADÍSTICAS
// ==========================================

// Muestra el reporte estadístico de manera visual por consola
function mostrarEstadisticas(): void {
  //limpiarPantalla();
    console.clear();
    console.log("========================================");
    console.log("       ESTADÍSTICAS DE TAREAS           ");
    console.log("========================================");

  // Llamamos al método del gestor con el nuevo nombre limpio
  const resultadoEstadisticas = gestor.obtenerEstadisticas();

   console.log("");
   console.log("Total de Tareas registradas: " + resultadoEstadisticas.totalTareas);

   console.log("");
   console.log("Cantidad y Porcentaje por Estado:");
   console.log("----------------------------------------");
    Object.entries(resultadoEstadisticas.reporteEstados).forEach(([nombreEstado, infoEstado]) => {
    console.log("• " + nombreEstado.padEnd(12) + ": " + infoEstado.cantidad + " tarea(s) (" + infoEstado.porcentaje + "%)");
  });

    console.log("");
    console.log("Cantidad y Porcentaje por Dificultad:");
    console.log("----------------------------------------");
    Object.entries(resultadoEstadisticas.reporteDificultades).forEach(([nombreDificultad, infoDificultad]) => {
    console.log("• " + nombreDificultad.padEnd(12) + ": " + infoDificultad.cantidad + " tarea(s) (" + infoDificultad.porcentaje + "%)");
  });

    console.log("");
    console.log("========================================");
    pausar();
}

// ==========================================
// CONSULTAS AVANZADAS
// ==========================================

// Maneja el submenú de inferencias y consultas avanzadas solicitadas
function consultasAvanzadas(): void {
  limpiarPantalla();
  console.log("--- Consultas Avanzadas e Inferencias ---");
  console.log("1. Listar tareas de prioridad alta (Difícil)");
  console.log("2. Buscar tareas relacionadas a una tarea");
  console.log("3. Listar todas las tareas vencidas");
  console.log("4. Volver");
  
  const opcion = prompt("Elige una opción: ") || "";
  limpiarPantalla();

  switch (opcion) {
    case "1": {
      console.log("=== TAREAS DE PRIORIDAD ALTA ===");
      const altas = gestor.obtenerPrioridadAlta();
      if (altas.length === 0) console.log("No hay tareas pendientes de prioridad alta.");
      else altas.forEach(mostrarTareaEstilizada);
      break;
    }
    case "2": {
      console.log("=== BUSCAR TAREAS RELACIONADAS ===");
      const id = Number(prompt("Ingresa el ID de la tarea base para buscar relaciones: "));
      const tareaBase = gestor.obtenerTodas().find(t => t.id === id);
      
      if (!tareaBase) {
        console.log("\nError: No se encontró ninguna tarea con ese ID.");
      } else {
        console.log("\nBuscando coincidencias para: "+ tareaBase.titulo +" ");
        const relacionadas = gestor.obtenerTareasRelacionadas(tareaBase);
        if (relacionadas.length === 0) console.log("No se encontraron tareas relacionadas.");
        else relacionadas.forEach(mostrarTareaEstilizada);
      }
      break;
    }
    case "3": {
      console.log("=== TAREAS VENCIDAS ===");
      const vencidas = gestor.obtenerTareasVencidas();
      if (vencidas.length === 0) console.log("¡Excelente! No tenés tareas vencidas.");
      else vencidas.forEach(mostrarTareaEstilizada);
      break;
    }
    case "4":
      return;
    default:
      console.log("Opción no válida.");
      break;
  }
  pausar();
}

// ==========================================
// MENÚ PRINCIPAL
// ==========================================

// Bucle principal de ejecución del Menú por consola.
export function iniciarMenu(): void {
  let opcion: string = "";
  do {
    limpiarPantalla();
    console.log("Bienvenido!\n");
    console.log("¿Qué deseas hacer?");
    console.log("1.Ver mis tareas");
    console.log("2.Buscar tarea");
    console.log("3.Agregar tarea");
    console.log("4.Ver Detalles de Tareas");
    console.log("5.Eliminar tarea");
    console.log("6.Ordenar tareas");
    console.log("7.Ver estadísticas de tareas"); 
    console.log("8.Consultas avanzadas e inferencias"); 
    console.log("9.Salir");

    opcion = prompt("\nElige una opción: ") || "";

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
        pausar();
        break;
      
      case "4":
        mostrarDetalles(); 
        break;

      case "5":
        eliminarTarea(); 
        break;

      case "6":
        limpiarPantalla();
        ordenarTareas();
        break;

      case "7":
        limpiarPantalla();
        mostrarEstadisticas();
        break;

      case "8":
        consultasAvanzadas(); 
        break;

      case "9":
        console.log("\n¡Saliendo de la aplicación! Que tengas un gran día.");
        break;

      default:
        console.log("Opción no válida. Intenta de nuevo.");
        pausar();
        break;
    }
  } while (opcion !== "9");
}