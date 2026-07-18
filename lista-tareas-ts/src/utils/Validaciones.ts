import promptSync from "prompt-sync";
const prompt = promptSync();

//MÓDULOS DE VALIDACIÓN (PE)

//Solicita de forma interactiva el título de la tarea obligando a que no esté vacío.
export function solicitarTitulo(): string {
  while (true) {
    const titulo = (prompt("Ingresa el título: ") || "").trim();
    if (titulo !== "") {
      return titulo;
    }
    console.log("Error: El título no puede quedar vacío. Intenta de nuevo.");
  }
}

// Solicita y normaliza el estado de la tarea verificando opciones permitidas.
export function solicitarEstado(): string {
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
export function solicitarVencimiento(): string {
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
export function solicitarDificultad(): string {
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
