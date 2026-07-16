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
      (a, b) => {
        if (a.fechaVencimiento === "Sin fecha" && b.fechaVencimiento === "Sin fecha") return 0;
        if (a.fechaVencimiento === "Sin fecha") return 1; // "Sin fecha" va al final de la lista
        if (b.fechaVencimiento === "Sin fecha") return -1;
      
       return new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime();
      }
    );
  }


  /**
   * Devuelve una copia de las tareas ordenadas por Fecha de Creación.
   * Al ser un ID incremental secuencial, ordenar por ID equivale a ordenar por creación.
   */
  public ordenarPorFechaCreacion(): Tarea[] {
    return [...this._tareas].sort((a, b) => a.id - b.id);
  }

  /**
 * Devuelve una copia de las tareas ordenadas por dificultad.
 */
  public ordenarPorDificultad(): Tarea[] {

    const prioridad = {
      "Fácil": 1,
      "Medio": 2,
      "Difícil": 3
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

  // Obtiene un reporte estadístico completo (Total, Estados y Dificultades).
  // Implementa Programación Funcional (.reduce y .forEach) para procesar los datos de manera declarativa
  public obtenerEstadisticas() {
    const totalTareas = this._tareas.length;
    const estadosValidos = ["Pendiente", "En curso", "Terminada"];
    const dificultadesValidas = ["Fácil", "Medio", "Difícil"];

    // Inicializamos los acumuladores de forma declarativa con .reduce
    const reporteEstados = estadosValidos.reduce((acumulador, estado) => {
      acumulador[estado] = { cantidad: 0, porcentaje: 0 };
      return acumulador;
    }, {} as Record<string, { cantidad: number; porcentaje: number }>);

    const reporteDificultades = dificultadesValidas.reduce((acumulador, dificultad) => {
      acumulador[dificultad] = { cantidad: 0, porcentaje: 0 };
      return acumulador;
    }, {} as Record<string, { cantidad: number; porcentaje: number }>);

    // Solo hacemos cálculos si hay tareas en la lista para evitar divisiones por cero
    if (totalTareas > 0) {
      
      //Contabilizamos las cantidades recorriendo la lista de tareas una sola vez
      this._tareas.forEach(tareaActual => {
        if (reporteEstados[tareaActual.estado] !== undefined) {
          reporteEstados[tareaActual.estado].cantidad++;
        }
        if (reporteDificultades[tareaActual.dificultad] !== undefined) {
          reporteDificultades[tareaActual.dificultad].cantidad++;
        }
      });

      // Calculamos los porcentajes prolijamente con un decimal (.toFixed(1))
      estadosValidos.forEach(estado => {
        const cantidadDeTareas = reporteEstados[estado].cantidad;
        reporteEstados[estado].porcentaje = Number(((cantidadDeTareas / totalTareas) * 100).toFixed(1));
      });

      dificultadesValidas.forEach(dificultad => {
        const cantidadDeTareas = reporteDificultades[dificultad].cantidad;
        reporteDificultades[dificultad].porcentaje = Number(((cantidadDeTareas / totalTareas) * 100).toFixed(1));
      });
    }

    // Devolvemos el objeto 
    return {
      totalTareas,
      reporteEstados,
      reporteDificultades
    };
  }

  //INFERENCIA 1: Listado de todas las tareas de prioridad alta (Dificultad "Difícil").
  public obtenerPrioridadAlta(): Tarea[] {
    return this._tareas.filter(
      tarea => tarea.dificultad === "Difícil" && tarea.estado !== "Terminada"
    );
  }

   //INFERENCIA 2: Listado de tareas relacionadas a una tarea específica. Considera que están relacionadas si comparten la misma dificultad o si
   //coinciden en alguna palabra significativa de sus títulos (ignorando conectores cortos).
  public obtenerTareasRelacionadas(tareaObjetivo: Tarea): Tarea[] { // Extraemos palabras clave del título (ignoramos palabras de 3 letras o menos como "de", "la", "con")
        const palabrasClave = tareaObjetivo.titulo
      .toLowerCase()
      .split(" ")
      .filter(palabra => palabra.length > 3);

    return this._tareas.filter(t => {
      // Excluimos la misma tarea de la búsqueda
      if (t.id === tareaObjetivo.id) return false;

      // Criterio 1: Comparten palabras significativas en el título
      const compartePalabras = palabrasClave.some(palabra => 
        t.titulo.toLowerCase().includes(palabra)
      );

      // Criterio 2: Tienen la misma dificultad
      const mismaDificultad = t.dificultad === tareaObjetivo.dificultad;

      return compartePalabras || mismaDificultad;
    });
  }

  //INFERENCIA 3: Listado de todas las tareas vencidas. Compara la fecha de vencimiento con el día de hoy.
  public obtenerTareasVencidas(): Tarea[] {
  const hoy = new Date();
    
    return this._tareas.filter(tarea => {
      // Si no tiene fecha o ya está terminada, no puede estar vencida
      if (tarea.fechaVencimiento === "Sin fecha" || tarea.estado === "Terminada") {
        return false;
      }
      
      const fechaVenc = new Date(tarea.fechaVencimiento);
      // Evaluamos si el tiempo de vencimiento es menor al momento actual
      return fechaVenc.getTime() < hoy.getTime();
    });
  }

}