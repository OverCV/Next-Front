
// src/constants/index.ts

import { Gender } from "../types";

// Roles de usuario
export const ROLES: Record<string, number> = {
  ADMINISTRADOR: 1,
  DESARROLLADOR: 2,
  ENTIDAD_SALUD: 3,
  MEDICO: 4,
  AUXILIAR: 5,
  PACIENTE: 6,
  EMBAJADOR: 7,
};

// Rutas para redirección según rol
export const RUTAS_POR_ROL: Record<number, string> = {
  [ROLES.ADMINISTRADOR]: "/dashboard/admin",
  [ROLES.DESARROLLADOR]: "/dashboard/desarrollador",
  [ROLES.ENTIDAD_SALUD]: "/dashboard/entidad",
  [ROLES.MEDICO]: "/dashboard/medico",
  [ROLES.AUXILIAR]: "/dashboard/auxiliar",
  [ROLES.PACIENTE]: "/dashboard/paciente",
  [ROLES.EMBAJADOR]: "/dashboard/embajador",
};

// Tipos de identificación
export interface TipoIdentificacion {
  valor: string;
  etiqueta: string;
}

export const TIPOS_IDENTIFICACION: TipoIdentificacion[] = [
  { valor: "cc", etiqueta: "Cédula de Ciudadanía" },
  { valor: "ti", etiqueta: "Tarjeta de Identidad" },
  { valor: "nit", etiqueta: "NIT" },
  { valor: "rcn", etiqueta: "Registro Civil de Nacimiento" },
];

// Estados de campaña
export const ESTADOS_CAMPANA: Record<string, string> = {
  POSTULADA: "POSTULADA",
  EJECUCION: "EJECUCION",
  FINALIZADA: "FINALIZADA",
};

// Opciones de género
export interface OpcionGenero {
  valor: string;
  etiqueta: string;
}

export const OPCIONES_GENERO: OpcionGenero[] = [
  { valor: "M", etiqueta: "Masculino" },
  { valor: "F", etiqueta: "Femenino" },
  { valor: "OTRO", etiqueta: "Otro" },
];

// Niveles de prioridad
export interface NivelPrioridad {
  valor: string;
  etiqueta: string;
}

export const NIVELES_PRIORIDAD: NivelPrioridad[] = [
  { valor: "ALTA", etiqueta: "Alta" },
  { valor: "MEDIA", etiqueta: "Media" },
  { valor: "BAJA", etiqueta: "Baja" },
];


// Viejo:


// export const GenderOptions = ["Male", "Female", "Other"];

// export const PatientFormDefaultValues = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   phone: "",
//   birthDate: new Date(Date.now()),
//   gender: "Male" as Gender,
//   address: "",
//   occupation: "",
//   emergencyContactName: "",
//   emergencyContactNumber: "",
//   primaryPhysician: "",
//   insuranceProvider: "",
//   insurancePolicyNumber: "",
//   allergies: "",
//   currentMedication: "",
//   familyMedicalHistory: "",
//   pastMedicalHistory: "",
//   identificationType: "Birth Certificate",
//   identificationNumber: "",
//   identificationDocument: [],
//   treatmentConsent: false,
//   disclosureConsent: false,
//   privacyConsent: false,
// };

// export const IdentificationTypes = [
//   "Birth Certificate",
//   "Driver's License",
//   "Medical Insurance Card/Policy",
//   "Military ID Card",
//   "National Identity Card",
//   "Passport",
//   "Resident Alien Card (Green Card)",
//   "Social Security Card",
//   "State ID Card",
//   "Student ID Card",
//   "Voter ID Card",
// ];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
