import { readFileSync, writeFileSync, existsSync } from "fs";
import { Tarea } from "../models/Tarea";

/**
 * Clase encargada de la lógica de negocio y gestión de tareas
 * Implementa POO (encapsulamiento de estado), Programación Funcional (inmutabilidad y HOFs)
 * y Programación Lógica
 */

export class GestorTareas { // Atributos privados: control absoluto de accesos (POO)
  private _tareas: Tarea[] = [];
  private _siguienteId: number = 1;
  private readonly _archivo = "tareas.json"; // Archivo de almacenamiento persistente

  // Constructor: carga las tareas desde el archivo al iniciar la aplicación
  constructor() {
    this.cargarArchivo();
  }

  // Guarda las tareas en el archivo JSON para persistencia de datos
  private guardarArchivo(): void {
      writeFileSync(
      this._archivo,
      JSON.stringify(this._tareas, null, 2),
      "utf8"
    );
  }

  // Carga las tareas desde el archivo JSON al iniciar la aplicación
  private cargarArchivo(): void {
    if (!existsSync(this._archivo)) {
      return;
    }

    const contenido = readFileSync(this._archivo, "utf8");

    if (contenido.trim() === "") {
      return;
    }

    const datos = JSON.parse(contenido);
    this._tareas = datos.map((tarea: any) => {

    const nueva = new Tarea(
      tarea._id,
      tarea._titulo,
      tarea._descripcion,
      tarea._estado,
      tarea._dificultad,
      tarea._fechaVencimiento,
      tarea._fechaCreacion
    );

    return nueva;

  });

    if (this._tareas.length > 0) {
      this._siguienteId =
      Math.max(...this._tareas.map(t => t.id)) + 1;

    }
  }

 //Crea una nueva tarea y la agrega al listado interno. Incrementa automáticamente el ID numérico único.
  public agregarTarea(titulo: string, descripcion: string, estado: string, dificultad: string, fechaVencimiento: string
  ): Tarea {
    const nuevaTarea = new Tarea(this._siguienteId, titulo, descripcion, estado, dificultad, fechaVencimiento);
    this._tareas.push(nuevaTarea);
    this.guardarArchivo(); //Persistencia de datos: guarda la lista actualizada en el archivo JSON
    this._siguienteId++;
    return nuevaTarea;
  }

  /**
 * Elimina una tarea por su ID.
 * Implementa Hard Delete: la tarea desaparece definitivamente
 * de la estructura de datos y del archivo JSON.
 *
 * @param id ID de la tarea a eliminar.
 * @returns true si la tarea fue eliminada, false si no existía.
 */
  public eliminarTarea(id: number): boolean {

    const cantidadAntes = this._tareas.length;

    this._tareas = this._tareas.filter(
      tarea => tarea.id !== id
    );

    if (this._tareas.length < cantidadAntes) {
      this.guardarArchivo();
      return true;
    }

    return false;
  }

  /**
 * Devuelve una copia de las tareas ordenadas alfabéticamente por título.
 * No modifica la lista original (inmutabilidad).
 */
  public ordenarPorTitulo(): Tarea[] {

    return [...this._tareas].sort(
      (a, b) => a.titulo.localeCompare(b.titulo)
    );

  }

  /**
 * Devuelve una copia de las tareas ordenadas por fecha de vencimiento.
 */
  public ordenarPorFechaVencimiento(): Tarea[] {

    return [...this._tareas].sort(
      (a, b) =>
        new Date(a.fechaVencimiento).getTime() -
        new Date(b.fechaVencimiento).getTime()
    );

  }

  /**
 * Devuelve una copia de las tareas ordenadas por dificultad.
 */
  public ordenarPorDificultad(): Tarea[] {

    const prioridad = {
      "Facil": 1,
      "Medio": 2,
      "Dificil": 3
    };

    return [...this._tareas].sort(
      (a, b) =>
        prioridad[a.dificultad as keyof typeof prioridad] -
        prioridad[b.dificultad as keyof typeof prioridad]
    );
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