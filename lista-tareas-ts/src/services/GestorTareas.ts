import { Tarea } from "../models/Tarea";

/**
 * Clase encargada de la lógica de negocio y gestión de tareas
 * Implementa POO (encapsulamiento de estado), Programación Funcional (inmutabilidad y HOFs)
 * y Programación Lógica
 */

export class GestorTareas { // Atributos privados: control absoluto de accesos (POO)
  private _tareas: Tarea[] = [];
  private _siguienteId: number = 1;

 //Crea una nueva tarea y la agrega al listado interno. Incrementa automáticamente el ID numérico único.

  public agregarTarea(titulo: string, descripcion: string, estado: string, dificultad: string, fechaVencimiento: string
  ): Tarea {
    const nuevaTarea = new Tarea(this._siguienteId, titulo, descripcion, estado, dificultad, fechaVencimiento);
    this._tareas.push(nuevaTarea);
    this._siguienteId++;
    return nuevaTarea;
  }

  
  //Obtiene una copia de la lista de tareas para proteger el estado original. Enfoque de inmutabilidad.

  public obtenerTodas(): Tarea[] {
    return [...this._tareas];
  }

  //Filtra las tareas de acuerdo con su estado actual. Utiliza Funciones de Orden Superior (.filter) y es una función pura.
  
  public filtrarPorEstado(estado: string): Tarea[] {
    return this._tareas.filter(
      (tarea) => tarea.estado.toLowerCase() === estado.toLowerCase()
    );
  }



  
  //Determina si una tarea cumple con la condición de contener el término buscado. Programcion Lógica.

  private esCoincidencia(tarea: Tarea, termino: string): boolean {
    const terminoMin = termino.toLowerCase();
    return (
      tarea.titulo.toLowerCase().includes(terminoMin) ||
      tarea.descripcion.toLowerCase().includes(terminoMin) ||
      tarea.estado.toLowerCase().includes(terminoMin)
    );
  }

  //Búsqueda lógica recursiva. Aplica recursión bien estructurada con caso base claro y sin bucles imperativos.
 
  
  public buscarRecursivo(termino: string, lista: Tarea[] = this._tareas): Tarea[] {
    if (lista.length === 0) { // Caso base de la recursión: si la lista está vacía, no hay nada más que buscar.
      return [];
    }

    // Desestructuración el array en la cabeza (primer elemento) y la cola (el resto de la lista)
    const [cabeza, ...cola] = lista;

    // Evaluamos el predicado en la cabeza de la lista
    const coincide = this.esCoincidencia(cabeza, termino);

    if (coincide) { // Si coincide, lo agregamos al resultado y llamamos recursivamente a evaluar la cola
      return [cabeza, ...this.buscarRecursivo(termino, cola)];
    } else { // Si no coincide, continuamos la recursión únicamente con la cola
      return this.buscarRecursivo(termino, cola);
    }
  }
}