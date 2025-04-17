
// src/constants/index.ts

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
  { valor: "CC", etiqueta: "Cédula de Ciudadanía" },
  { valor: "TI", etiqueta: "Tarjeta de Identidad" },
  { valor: "NIT", etiqueta: "NIT" },
  { valor: "RCN", etiqueta: "Registro Civil de Nacimiento" },
];

export const TIPOS_IDENTIFICACION_PACIENTE: TipoIdentificacion[] = [
  { valor: "CC", etiqueta: "Cédula de Ciudadanía" },
  { valor: "TI", etiqueta: "Tarjeta de Identidad" },
  { valor: "RCN", etiqueta: "Registro Civil de Nacimiento" },
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
  { valor: "MASCULINO", etiqueta: "Masculino" },
  { valor: "FEMENINO", etiqueta: "Femenino" },
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
  ejecucion: "/assets/icons/ambulancia.svg",
  finalizada: "/assets/icons/activa.svg",
  cancelada: "/assets/icons/cancelada.svg",
};

// Simulación de datos
export const PACIENTES_MOCK = [
  { id: 1, nombres: 'Juan', apellidos: 'Pérez', identificacion: '1234567890', fecha: '2023-03-28' },
  { id: 2, nombres: 'María', apellidos: 'López', identificacion: '0987654321', fecha: '2023-03-27' },
  { id: 3, nombres: 'Carlos', apellidos: 'González', identificacion: '5678901234', fecha: '2023-03-26' },
  { id: 4, nombres: 'Ana', apellidos: 'Martínez', identificacion: '4321098765', fecha: '2023-03-25' },
];

// Campañas mock para desarrollo
export const CAMPANAS_MOCK = [
  {
    id: 1,
    nombre: "Jornada Cardiovascular Rural",
    descripcion: "Evaluación y prevención de riesgo cardiovascular en zonas rurales",
    fechaInicio: "2025-04-15T00:00:00",
    fechaLimite: "2025-04-20T00:00:00",
    minParticipantes: 30,
    maxParticipantes: 50,
    entidadId: 1,
    estatus: "postulada",
    fechaCreacion: "2025-03-01T00:00:00",
    pacientes: 18,
    fecha: "15 de abril, 2025",
    localizacion: {
      id: 1,
      departamento: "Antioquia",
      municipio: "Santa Fe",
      vereda: "El Retiro"
    }
  },
  {
    id: 2,
    nombre: "Prevención Hipertensión",
    descripcion: "Campaña de detección temprana y control de la hipertensión",
    fechaInicio: "2025-05-10T00:00:00",
    fechaLimite: "2025-05-12T00:00:00",
    minParticipantes: 20,
    maxParticipantes: 40,
    entidadId: 2,
    estatus: "ejecucion",
    fechaCreacion: "2025-03-15T00:00:00",
    pacientes: 32,
    fecha: "10 de mayo, 2025",
    localizacion: {
      id: 2,
      departamento: "Cundinamarca",
      municipio: "Subachoque",
      vereda: "La Pradera"
    }
  },
  {
    id: 3,
    nombre: "Diabetes: Detección y Control",
    descripcion: "Evaluación de niveles de glucosa y factores de riesgo asociados",
    fechaInicio: "2025-06-05T00:00:00",
    fechaLimite: "2025-06-07T00:00:00",
    minParticipantes: 15,
    maxParticipantes: 35,
    entidadId: 1,
    estatus: "postulada",
    fechaCreacion: "2025-04-01T00:00:00",
    pacientes: 12,
    fecha: "5 de junio, 2025",
    localizacion: {
      id: 3,
      departamento: "Santander",
      municipio: "Piedecuesta",
      vereda: "San Isidro"
    }
  },
  {
    id: 4,
    nombre: "Salud Cardiovascular para Adultos Mayores",
    descripcion: "Programa especial para evaluación cardiovascular en adultos mayores",
    fechaInicio: "2025-07-15T00:00:00",
    fechaLimite: "2025-07-20T00:00:00",
    minParticipantes: 25,
    maxParticipantes: 45,
    entidadId: 3,
    estatus: "ejecucion",
    fechaCreacion: "2025-05-01T00:00:00",
    pacientes: 28,
    fecha: "15 de julio, 2025",
    localizacion: {
      id: 4,
      departamento: "Valle del Cauca",
      municipio: "El Cerrito",
      vereda: "El Placer"
    }
  }
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


