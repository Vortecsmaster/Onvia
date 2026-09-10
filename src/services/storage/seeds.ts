import type { Workspace } from "../../domain/models";
// Fixture data is isolated from production domain models and views.
export function createWorkspace(): Workspace {
  return {
    version: 2,
    profile: null,
    prepared: false,
    conditions: [
      "Hipertensión arterial",
      "Rinitis alérgica",
      "Migraña",
      "Gastritis",
      "Asma",
      "Hipotiroidismo",
      "Dermatitis atópica",
      "Intolerancia a la lactosa",
      "Miopía",
      "Anemia ferropénica",
    ].map((name, i) => ({
      id: `c${i}`,
      name,
      diagnosisDate: `2025-${String(i + 1).padStart(2, "0")}-12`,
    })),
    medications: [
      "Losartán",
      "Loratadina",
      "Paracetamol",
      "Omeprazol",
      "Salbutamol",
      "Levotiroxina",
      "Crema hidratante",
      "Lactasa",
      "Lágrimas artificiales",
      "Sulfato ferroso",
    ].map((name, i) => ({
      id: `m${i}`,
      name,
      prescriptionDate: "2026-08-20",
      treatment:
        i % 3 === 0
          ? { lifelong: true }
          : { lifelong: false, startDate: "2026-08-20", endDate: "2026-10-20" },
    })),
    history: [
      {
        id: "h1",
        title: "Consulta de seguimiento",
        createdDate: "2026-09-08",
        detail:
          "Conversé con mi médico sobre cómo me he sentido durante las últimas semanas. Quiero llevar mis preguntas a la próxima consulta.",
      },
      {
        id: "h2",
        title: "Control anual",
        createdDate: "2026-08-15",
        detail: "Mis consultas y documentos, organizados en un solo lugar.",
      },
      {
        id: "h3",
        title: "Mis preguntas para la consulta",
        createdDate: "2026-07-28",
        detail: "¿Qué información debo llevar a mi próxima cita?",
      },
    ],
  };
}
