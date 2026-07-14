import promptSync from "prompt-sync";
const prompt = promptSync();
// Importa la librería para pedir datos al usuario por consola.


// Interfaz que define qué datos obligatorios debe tener una tarea.
interface Tarea {
  titulo: string;
  descripcion: string;
  estado: string;
  fechaCreacion: string;
  fechaVencimiento: string;
  dificultad: string;
}

// Creamos la lista para guardar tareas.
let tareas: Tarea[] = new Array(100);

// Cuenta cuántas tareas reales fuimos agregando hasta el momento.
let numTareas: number = 0;

// Guarda la opción que el usuario elige en el menú principal.
let opcion: string = "";


do {
  console.clear(); // Limpia la pantalla para que el menú se vea ordenado.
  console.log("Bienvenido!\n");
  console.log("¿Qué deseas hacer?");
  console.log("1.Ver mis tareas");
  console.log("2.Buscar tarea");
  console.log("3.Agregar tarea");
  console.log("4.Ver Detalles de Tareas");
  console.log("5.Salir\n");

  opcion = prompt("Elige una opción: ") || "";

  switch (opcion) {
    case "1":
      verTareas(); // Va a la función para listar las tareas.
      break;

    case "2":
      buscarTarea(); // Va a la función para buscar por texto.
      break;

    case "3":
      // Revisa si todavía queda espacio en la lista de 10 tareas.
      if (numTareas < tareas.length) {
        
        // --- VALIDAR TÍTULO ---
        let titulo = "";
        while (true) {
          // .trim() quita los espacios vacíos al principio y al final.
          titulo = (prompt("Ingresa el título: ") || "").trim();
          if (titulo !== "") {
            break; // Si escribió algo de texto, sale del bucle y continúa.
          }
          console.log("Error: El título no puede quedar vacío. Intenta de nuevo.");
        }

        // La descripción es opcional. Si presiona Enter, se guarda vacía.
        let descripcion = prompt("Ingresa la descripción: ") || "";

        // --- VALIDAR ESTADO ---
        let estado = "";
        const estadosValidos = ["pendiente", "en curso", "terminada"];
        while (true) {
          // Pasamos a minúsculas lo que escriba para comparar más fácil.
          estado = (prompt("Ingresa el estado (En curso, Pendiente, Terminada): ") || "").trim().toLowerCase();
          if (estadosValidos.includes(estado)) {
            // Guardamos el texto con las mayúsculas prolijas.
            if (estado === "pendiente") estado = "Pendiente";
            if (estado === "en curso") estado = "En curso";
            if (estado === "terminada") estado = "Terminada";
            break; // Si es un estado correcto, sale del bucle.
          }
          console.log("Error: Estado no válido. Escribe 'Pendiente', 'En curso' o 'Terminada'.");
        }

        // --- VALIDAR FECHA DE VENCIMIENTO ---
        let vencimiento = "";
        while (true) {
          vencimiento = (prompt("Ingresa la fecha de vencimiento (AAAA-MM-DD, opcional): ") || "").trim();
          if (vencimiento === "") {
            vencimiento = "Sin fecha"; // Si da Enter, queda este texto por defecto.
            break; 
          }
          // Revisa si el texto ingresado se puede transformar en una fecha de verdad.
          const fechaPrueba = new Date(vencimiento);
          if (!isNaN(fechaPrueba.getTime())) {
            break; // Si la fecha es real y lógica, sale del bucle.
          }
          console.log("Error: Fecha inválida. Escribe un formato real como AAAA-MM-DD (ej: 2026-12-31).");
        }

        // --- VALIDAR DIFICULTAD ---
        let dificultad = "";
        const dificultadesValidas = ["fácil", "facil", "medio", "difícil", "dificil"];
        while (true) {
          dificultad = (prompt("Ingresa la dificultad (fácil, medio, difícil): ") || "").trim().toLowerCase();
          if (dificultadesValidas.includes(dificultad)) {
            // Guardamos el texto corregido con su acento correspondiente.
            if (dificultad === "facil" || dificultad === "fácil") dificultad = "Fácil";
            if (dificultad === "medio") dificultad = "Medio";
            if (dificultad === "dificil" || dificultad === "difícil") dificultad = "Difícil";
            break; 
          }
          console.log("Error: Dificultad no válida. Escribe 'fácil', 'medio' o 'difícil'.");
        }

        // Armamos el objeto de la nueva tarea con los datos ya revisados.
        const nuevaTarea: Tarea = {
          titulo: titulo,
          descripcion: descripcion,
          estado: estado,
          fechaCreacion: new Date().toLocaleString(), // Pone la fecha y hora actual del sistema.
          fechaVencimiento: vencimiento,
          dificultad: dificultad,
        };

        // Guarda la tarea en la posición libre de la lista e incrementa el contador.
        tareas[numTareas] = nuevaTarea;
        numTareas++; 

        console.log("\n¡Tarea agregada con éxito!");
      } else {
        console.log("\n¡No se pueden agregar más tareas! El espacio está lleno.");
      }
      prompt("Presiona Enter para continuar...");
      break;

    case "4":
      mostrarDetalles(); // Va a la función para ver tareas detalladas.
      break;

    case "5":
      console.log("Salir"); // Termina el bucle y cierra el programa.
      break;

    default:
      console.log("Opción no válida. Intenta de nuevo.");
      prompt("Presiona Enter para continuar...");
      break;
  }
} while (opcion !== "5");


// --- FUNCIÓN VER TAREAS ---
// Muestra una lista resumida de tareas según la opción elegida.
function verTareas(): void {
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
function mostrarDetalles(): void {
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
function buscarTarea(): void {
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