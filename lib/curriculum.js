// Cambia esta fecha por el día en que EMPEZASTE tu curso (formato AAAA-MM-DD).
const FECHA_INICIO = '2026-09-25';

const DIAS_POR_MES = 30;
const TOTAL_MESES = 3;
export const TOTAL_DIAS = DIAS_POR_MES * TOTAL_MESES; // 90
export { DIAS_POR_MES, TOTAL_MESES };

// Cada mes tiene 5 bloques temáticos, y cada bloque dura 6 días (30 / 5 = 6)
const MESES = [
  {
    mes: 1,
    nivel: 'A1-A2',
    temas: [
      'Presente simple, verbo to be, saludos',
      'Artículos, sustantivos, plural',
      'Rutinas diarias y presente simple con otros verbos',
      'Pasado simple, verbos regulares',
      'Pasado simple, verbos irregulares',
    ],
  },
  {
    mes: 2,
    nivel: 'B1-B2',
    temas: [
      'Futuro con going to y will',
      'Presente perfecto',
      'Comparativos y superlativos',
      'Condicionales tipo 1 y 2',
      'Voz pasiva',
    ],
  },
  {
    mes: 3,
    nivel: 'B2-C1',
    temas: [
      'Discurso indirecto (reported speech)',
      'Phrasal verbs y expresiones idiomáticas',
      'Cláusulas relativas',
      'Modales de probabilidad y deducción',
      'Inglés de negocios y conversación avanzada',
    ],
  },
];

// Devuelve nivel/tema/mes para CUALQUIER día del plan (no solo el de hoy)
export function obtenerInfoDia(diaSolicitado) {
  const dia = Math.min(Math.max(Math.round(diaSolicitado) || 1, 1), TOTAL_DIAS);
  const mesIndex = Math.min(Math.ceil(dia / DIAS_POR_MES) - 1, MESES.length - 1);
  const infoMes = MESES[mesIndex];
  const diaDentroDelMes = dia - mesIndex * DIAS_POR_MES;
  const diasPorTema = DIAS_POR_MES / infoMes.temas.length;
  const temaIndex = Math.min(Math.ceil(diaDentroDelMes / diasPorTema) - 1, infoMes.temas.length - 1);

  return {
    dia,
    mes: infoMes.mes,
    nivel: infoMes.nivel,
    temaGramatical: infoMes.temas[temaIndex],
  };
}

// Calcula el número de día "de hoy" según la fecha de inicio del curso
export function obtenerDiaActual() {
  const inicio = new Date(FECHA_INICIO);
  const hoy = new Date();
  const diffMs = hoy.setHours(0, 0, 0, 0) - inicio.setHours(0, 0, 0, 0);
  let dia = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  if (dia < 1) dia = 1;
  if (dia > TOTAL_DIAS) dia = TOTAL_DIAS;
  return dia;
}

// ---- Prompts para cada tipo de contenido ----

export function construirPromptLeccion({ dia, mes, nivel, temaGramatical }) {
  return `Eres un profesor experto de inglés como lengua extranjera.

Genera la lección del día para un estudiante de habla hispana que sigue un plan de 3 meses de inglés (90 días).

Datos de esta lección:
- Mes: ${mes} de 3
- Nivel CEFR objetivo: ${nivel}
- Tema gramatical del bloque: ${temaGramatical}
- Día del plan: ${dia}

Requisitos:
1. Conéctate lógicamente con el tema del bloque.
2. Incluye 8-10 palabras de vocabulario nuevo, con ejemplo.
3. Incluye una explicación clara de la gramática, en español, con ejemplos en inglés.
4. Incluye 5 oraciones de ejemplo.
5. Incluye EXACTAMENTE 8 preguntas de opción múltiple (4 opciones cada una) para practicar lo aprendido, variando la dificultad.
6. Tono motivador, claro, para estudio autónomo.

Devuelve ÚNICAMENTE un JSON válido, sin texto adicional, con esta estructura exacta:

{
  "dia": numero,
  "mes": numero,
  "nivel": "string",
  "titulo_leccion": "string",
  "vocabulario": [{"ingles": "string", "espanol": "string", "ejemplo": "string"}],
  "explicacion_gramatical": "string",
  "oraciones_ejemplo": ["string", "string", "string", "string", "string"],
  "ejercicios": [
    {"pregunta": "string", "opciones": ["string","string","string","string"], "respuesta_correcta": "string"}
  ]
}

El array "ejercicios" debe tener EXACTAMENTE 8 elementos.`;
}

export function construirPromptVocabulario({ dia, mes, nivel, temaGramatical }) {
  return `Eres un profesor experto de inglés como lengua extranjera.

Genera una lista de vocabulario para el día ${dia} de un plan de 3 meses de inglés, para un estudiante de habla hispana.

- Mes: ${mes} de 3, nivel ${nivel}
- Tema del bloque: ${temaGramatical}

Genera EXACTAMENTE 30 palabras o expresiones relacionadas con el tema, cada una con su traducción y una oración de ejemplo en inglés.

Devuelve ÚNICAMENTE un JSON válido, sin texto adicional:

{
  "dia": ${dia},
  "vocabulario": [
    {"ingles": "string", "espanol": "string", "ejemplo": "string"}
  ]
}

El array "vocabulario" debe tener EXACTAMENTE 30 elementos.`;
}

export function construirPromptFrases({ dia, mes, nivel, temaGramatical }) {
  return `Eres un experto en cultura y modismos de Estados Unidos.

Genera 10 frases usadas comúnmente en películas o en el día a día en Estados Unidos, apropiadas para un estudiante de inglés de nivel ${nivel} (día ${dia} de un plan de 3 meses).

Para cada frase incluye: la frase en inglés, su significado real en español (no traducción literal), y un breve contexto de cuándo se usa.

Devuelve ÚNICAMENTE un JSON válido, sin texto adicional:

{
  "dia": ${dia},
  "frases": [
    {"frase": "string", "significado": "string", "contexto": "string"}
  ]
}

El array "frases" debe tener EXACTAMENTE 10 elementos.`;
}

export function construirPromptHistorias({ dia, mes, nivel, temaGramatical }) {
  return `Eres un escritor de historias cortas para estudiantes de inglés.

Genera 2 historias o cuentos cortos en inglés, apropiados para el nivel ${nivel} (día ${dia} de un plan de 3 meses, tema del bloque: ${temaGramatical}).

Cada historia debe tener entre 100 y 200 palabras en inglés, con vocabulario apropiado al nivel, más un resumen breve en español.

Devuelve ÚNICAMENTE un JSON válido, sin texto adicional:

{
  "dia": ${dia},
  "historias": [
    {"titulo": "string", "texto_ingles": "string", "resumen_espanol": "string"}
  ]
}

El array "historias" debe tener EXACTAMENTE 2 elementos.`;
}