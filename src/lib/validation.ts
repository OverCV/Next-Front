import { z } from "zod";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  birthDate: z.coerce.date(),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be at most 500 characters"),
  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number"
    ),
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  insuranceProvider: z
    .string()
    .min(2, "Insurance name must be at least 2 characters")
    .max(50, "Insurance name must be at most 50 characters"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Policy number must be at least 2 characters")
    .max(50, "Policy number must be at most 50 characters"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to treatment in order to proceed",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

export const CampaignCreationSchema = z
  .object({
    nombre: z
      .string()
      .min(1, "El nombre es requerido")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder 100 caracteres"),

    descripcion: z
      .string()
      .min(1, "La descripción es requerida")
      .min(10, "La descripción debe tener al menos 10 caracteres")
      .max(500, "La descripción no puede exceder 500 caracteres"),

    localizacionId: z.number({
      required_error: "La localizacion de la campaña es requerido",
    }),

    fechaInicio: z
      .date({
        required_error: "La fecha de inicio es requerida",
        invalid_type_error: "Debe ser una fecha válida",
      })
      .refine(
        (fecha) => fecha >= new Date(new Date().setHours(0, 0, 0, 0)),
        "La fecha de inicio no puede ser anterior a hoy"
      ),

    fechaLimite: z.date({
      required_error: "La fecha límite es requerida",
      invalid_type_error: "Debe ser una fecha válida",
    }),

    fechaLimiteInscripcion: z.date({
      required_error: "La fecha límite de inscripción es requerida",
      invalid_type_error: "Debe ser una fecha válida",
    }),

    minParticipantes: z
      .number({
        required_error: "El mínimo de participantes es requerido",
        invalid_type_error: "Debe ser un número válido",
      })
      .int("Debe ser un número entero")
      .min(1, "Mínimo 1 participante")
      .max(1000, "Máximo 1000 participantes"),

    maxParticipantes: z
      .number({
        required_error: "El máximo de participantes es requerido",
        invalid_type_error: "Debe ser un número válido",
      })
      .int("Debe ser un número entero")
      .min(1, "Mínimo 1 participante")
      .max(1000, "Máximo 1000 participantes"),

    serviciosIds: z
      .array(z.string())
      .min(1, "Debe seleccionar al menos un servicio"),

    factoresIds: z
      .array(z.string())
      .min(0, "Debe seleccionar al menos un factor"),
  })
  .refine((data) => data.fechaLimite > data.fechaInicio, {
    message: "La fecha límite debe ser posterior a la fecha de inicio",
    path: ["fechaLimite"],
  })
  .refine((data) => data.fechaLimiteInscripcion <= data.fechaLimite, {
    message:
      "La fecha límite de inscripción debe ser anterior o igual a la fecha límite de la campaña",
    path: ["fechaLimiteInscripcion"],
  })
  .refine(
    (data) =>
      data.fechaLimiteInscripcion >= new Date(new Date().setHours(0, 0, 0, 0)),
    {
      message: "La fecha límite de inscripción no puede ser anterior a hoy",
      path: ["fechaLimiteInscripcion"],
    }
  )
  .refine((data) => data.maxParticipantes >= data.minParticipantes, {
    message: "El máximo de participantes debe ser mayor o igual al mínimo",
    path: ["maxParticipantes"],
  });

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}
