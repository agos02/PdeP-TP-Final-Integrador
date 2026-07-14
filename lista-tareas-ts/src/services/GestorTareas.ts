import promptSync from "prompt-sync";
import { tareas, numTareas } from "../utils/Menu";

const prompt = promptSync();

// --- FUNCIÓN VER TAREAS ---
// Muestra una lista resumida de tareas según la opción elegida.
export function verTareas(): void {
  console.clear(); 
  let subOpcion: string | undefined;

  console.log("¿Qué tarea deseas ver?");
  console.log("1.Todas");
  console.log("2.Pendientes");
  console.log("3.Terminadas");
  console.log("4.En Curso");
  console.log("5.Volver");
  subOpcion = prompt("Elige una opción: ") || "";

  switch (subOpcion) {
    case "1":
      console.clear();
      console.log("Todas tus tareas:");
      if (numTareas === 0) {
        console.log("No tienes tareas agregadas.");
      } else {  
        // Recorre solo las tareas guardadas para no mostrar los espacios vacíos del array.
        for (let i = 0; i < numTareas; i++) {
          const tareaActual = tareas[i];  
          console.log("\n--- Tarea " + (i + 1) + " ---");
          console.log("Título: " + tareaActual.titulo);
          console.log("Descripción: " + tareaActual.descripcion);
          console.log("Estado: " + tareaActual.estado);
          console.log("Dificultad: " + tareaActual.dificultad);
          console.log("Fecha de Creación: " + tareaActual.fechaCreacion);
          console.log("Fecha de Vencimiento: " + tareaActual.fechaVencimiento);
        }
      }
      break;

    case "2":
      console.clear(); 
      console.log("Tus tareas pendientes:");
      let contadorPendientes = 0; // Lleva la cuenta de cuántas tareas pendientes encontramos.
      
      for (let i = 0; i < numTareas; i++) {
        const tareaActual = tareas[i];
        if (tareaActual.estado && tareaActual.estado.toLowerCase() === "pendiente") { 
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
      break;

    default:
      console.log("Opción no válida."); 
      break;
  }

  prompt("\nPresiona Enter para continuar..."); 
}


// --- FUNCIÓN MOSTRAR DETALLES ---
// Muestra todos los datos de las tareas filtrando por el estado que el usuario escriba.
export function mostrarDetalles(): void {
  console.clear();

  let estadoBuscado =
    prompt("Ingresa el estado de la tarea que quieres ver (Pendiente, Terminada, En Curso, Todas): ") || "";

  let contador = 0; // Cuenta cuántas tareas coinciden con lo buscado.

  console.log("\nMostrando detalles de tareas: " + estadoBuscado);

  if (estadoBuscado.toLowerCase() === "todas") {
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
  } else {
    for (let i = 0; i < numTareas; i++) {
      const tareaActual = tareas[i];

      // Compara sin importar si el usuario usó mayúsculas o minúsculas.
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
// Busca coincidencias de texto dentro de títulos, descripciones o estados.
export function buscarTarea(): void {
  console.clear(); 
  console.log("--- Búsqueda de Tarea ---");

  let terminoBusqueda = prompt("Ingresa el título, descripción o estado de la tarea a buscar: ") || "";
  let terminoMinusc = terminoBusqueda.toLowerCase(); 

  let contadorResultados = 0; 

  for (let i = 0; i < numTareas; i++) { 
    const tareaActual = tareas[i]; 
    
    // .includes() revisa si la palabra buscada está metida dentro del texto de la tarea.
    if (
      tareaActual.titulo.toLowerCase().includes(terminoMinusc) ||
      tareaActual.descripcion.toLowerCase().includes(terminoMinusc) ||
      tareaActual.estado.toLowerCase().includes(terminoMinusc)
    ) { 
      console.log("\n--- Coincidencia Encontrada (Tarea " + (i + 1) + ") ---");
      console.log("Título: " + tareaActual.titulo);
      console.log("Descripción: " + tareaActual.descripcion);
      console.log("Estado: " + tareaActual.estado);
      console.log("Dificultad: " + tareaActual.dificultad);
      console.log("Fecha de Creación: " + tareaActual.fechaCreacion);
      console.log("Fecha de Vencimiento: " + tareaActual.fechaVencimiento);
      contadorResultados++; 
    }
  }

  if (contadorResultados === 0) { 
    console.log("\nNo se encontraron tareas que coincidan con: " + terminoBusqueda);
  }

  prompt("\nPresiona Enter para continuar..."); 
}