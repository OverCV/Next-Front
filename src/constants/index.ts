
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

export const ROLES_NOMBRE: Record<number, string> = {
  [ROLES.ADMINISTRADOR]: "Administrador",
  [ROLES.DESARROLLADOR]: "Desarrollador",
  [ROLES.ENTIDAD_SALUD]: "Entidad de Salud",
  [ROLES.MEDICO]: "Médico",
  [ROLES.AUXILIAR]: "Auxiliar",
  [ROLES.PACIENTE]: "Paciente",
  [ROLES.EMBAJADOR]: "Embajador",
};


// Rutas para redirección según rol
export const RUTAS_POR_ROL: Record<number, string> = {
  [ROLES.ADMINISTRADOR]: "/admin",
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

export const TIPOS_IDENTIFICACION_PACIENTE: TipoIdentificacion[] = [
  { valor: "cc", etiqueta: "Cédula de Ciudadanía" },
  { valor: "ti", etiqueta: "Tarjeta de Identidad" },
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


export const StatusIcon = {
  postulada: "/assets/icons/postulada.svg",
  ejecucion: "/assets/icons/activa.svg",
  cancelada: "/assets/icons/cancelada.svg",
};

// Simulación de datos
export const PACIENTES_MOCK = [
  { id: 1, nombres: 'Juan', apellidos: 'Pérez', identificacion: '1234567890', fecha: '2023-03-28' },
  { id: 2, nombres: 'María', apellidos: 'López', identificacion: '0987654321', fecha: '2023-03-27' },
  { id: 3, nombres: 'Carlos', apellidos: 'González', identificacion: '5678901234', fecha: '2023-03-26' },
  { id: 4, nombres: 'Ana', apellidos: 'Martínez', identificacion: '4321098765', fecha: '2023-03-25' },
];

export const CAMPANAS_MOCK = [
  { id: 1, nombre: 'Campaña Cardiovascular Medellín', estatus: "ejecucion", pacientes: 45, fecha: '2023-04-15' },
  { id: 2, nombre: 'Prevención Hipertensión Cali', estatus: "postulada", pacientes: 23, fecha: '2023-05-10' },
];

// Viejo:

export const Doctores = [
  {
    imagen: "/assets/images/dr-green.png",
    nombres: "John Green",
  },
  {
    imagen: "/assets/images/dr-cameron.png",
    nombres: "Leila Cameron",
  },
  {
    imagen: "/assets/images/dr-livingston.png",
    nombres: "David Livingston",
  },
  {
    imagen: "/assets/images/dr-peter.png",
    nombres: "Evan Peter",
  },
  {
    imagen: "/assets/images/dr-powell.png",
    nombres: "Jane Powell",
  },
  {
    imagen: "/assets/images/dr-remirez.png",
    nombres: "Alex Ramirez",
  },
  {
    imagen: "/assets/images/dr-lee.png",
    nombres: "Jasmine Lee",
  },
  {
    imagen: "/assets/images/dr-cruz.png",
    nombres: "Alyana Cruz",
  },
  {
    imagen: "/assets/images/dr-sharma.png",
    nombres: "Hardik Sharma",
  },
];

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


