// Interfaz que define qué datos obligatorios debe tener una tarea.
export interface Tarea {
  titulo: string;
  descripcion: string;
  estado: string;
  fechaCreacion: string;
  fechaVencimiento: string;
  dificultad: string;
}