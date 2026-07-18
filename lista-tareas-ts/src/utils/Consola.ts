import promptSync from "prompt-sync";
import { Tarea } from "../models/Tarea";

const prompt = promptSync();

//Limpia la terminal por completo borrando el historial de scroll, cuando console.clear no funcione
export function limpiarPantalla(): void {
  process.stdout.write("\x1Bc");
}

//Procedimiento encargado de imprimir de manera prolija una tarea.
export function mostrarTareaEstilizada(tarea: Tarea): void {
  console.log(`\n--- Tarea ID: ${tarea.id} ---`);
  console.log(`Título: ${tarea.titulo}`);
  console.log(`Descripción: ${tarea.descripcion}`);
  console.log(`Estado: ${tarea.estado}`);
  console.log(`Dificultad: ${tarea.dificultad}`);
  console.log(`Fecha de Creación: ${tarea.fechaCreacion}`);
  console.log(`Fecha de Vencimiento: ${tarea.fechaVencimiento}`);
}

// Espera a que el usuario presione Enter.
export function pausar(): void {
  prompt("\nPresiona Enter para continuar...");
}

// Muestra una lista de tareas o un mensaje si está vacía.
export function mostrarLista(tareas: Tarea[]): void {

  if (tareas.length === 0) {
    console.log("No hay tareas para mostrar.");
    return;
  }

  tareas.forEach(mostrarTareaEstilizada);
}

