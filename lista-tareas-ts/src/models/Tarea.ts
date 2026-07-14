/**
 * Representa una tarea individual dentro del sistema.
 * Aplica los principios de POO: Encapsulamiento y Ocultamiento de información.
 * Una vez creada la tarea, su ID y fecha de creación no pueden ser modificados.
 */
export class Tarea {
  private readonly _id: number;
  private _titulo: string;
  private _descripcion: string;
  private _estado: string;
  private readonly _fechaCreacion: string;
  private _fechaVencimiento: string;
  private _dificultad: string;

  
  //Crea una instancia de Tarea.
  constructor(id: number, titulo: string, descripcion: string, estado: string, dificultad: string, fechaVencimiento: string = "Sin fecha"){
    this._id = id;
    this._titulo = titulo;
    this._descripcion = descripcion;
    this._estado = estado;
    this._fechaCreacion = new Date().toLocaleString();
    this._fechaVencimiento = fechaVencimiento;
    this._dificultad = dificultad;
  }

  // --- GETTERS (POO: Ocultamiento de detalles internos) ---

  public get id(): number {
    return this._id;
  }

  public get titulo(): string {
    return this._titulo;
  }

  public get descripcion(): string {
    return this._descripcion;
  }

  public get estado(): string {
    return this._estado;
  }

  public get fechaCreacion(): string {
    return this._fechaCreacion;
  }

  public get fechaVencimiento(): string {
    return this._fechaVencimiento;
  }

  public get dificultad(): string {
    return this._dificultad;
  }
}