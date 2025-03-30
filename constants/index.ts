
// src/constants/index.ts

// Roles de usuario
export const ROLES = {
  ADMINISTRADOR: 1,
  DESARROLLADOR: 2,
  ENTIDAD_SALUD: 3,
  MEDICO: 4,
  AUXILIAR: 5,
  PACIENTE: 6,
  EMBAJADOR: 7,
};

// Nombres de roles para mostrar
export const NOMBRES_ROLES = {
  [ROLES.ADMINISTRADOR]: 'Administrador',
  [ROLES.DESARROLLADOR]: 'Desarrollador',
  [ROLES.ENTIDAD_SALUD]: 'Entidad de Salud',
  [ROLES.MEDICO]: 'Médico',
  [ROLES.AUXILIAR]: 'Auxiliar',
  [ROLES.PACIENTE]: 'Paciente',
  [ROLES.EMBAJADOR]: 'Embajador',
};

// Tipos de identificación
export const TIPOS_IDENTIFICACION = [
  { valor: 'cc', etiqueta: 'Cédula de Ciudadanía' },
  { valor: 'ti', etiqueta: 'Tarjeta de Identidad' },
  { valor: 'nit', etiqueta: 'NIT' },
  { valor: 'rcn', etiqueta: 'Registro Civil de Nacimiento' },
  { valor: 'ce', etiqueta: 'Cédula de Extranjería' },
  { valor: 'pp', etiqueta: 'Pasaporte' },
];

// Estados de campaña
export const ESTADOS_CAMPANA = {
  POSTULADA: 'POSTULADA',
  EJECUCION: 'EJECUCION',
  FINALIZADA: 'FINALIZADA',
};

// Opciones de género
export const OPCIONES_GENERO = [
  { valor: 'M', etiqueta: 'Masculino' },
  { valor: 'F', etiqueta: 'Femenino' },
  { valor: 'OTRO', etiqueta: 'Otro' },
];

// Niveles de prioridad
export const NIVELES_PRIORIDAD = [
  { valor: 'ALTA', etiqueta: 'Alta' },
  { valor: 'MEDIA', etiqueta: 'Media' },
  { valor: 'BAJA', etiqueta: 'Baja' },
];

// Estados de entidades de salud
export const ESTADOS_ENTIDAD = [
  { valor: 'ACTIVA', etiqueta: 'Activa' },
  { valor: 'INACTIVA', etiqueta: 'Inactiva' },
  { valor: 'SUSPENDIDA', etiqueta: 'Suspendida' },
];

// Estados de embajador
export const ESTADOS_EMBAJADOR = [
  { valor: 'ACTIVO', etiqueta: 'Activo' },
  { valor: 'INACTIVO', etiqueta: 'Inactivo' },
];

// Estados de paciente
export const ESTADOS_PACIENTE = [
  { valor: 'ACTIVO', etiqueta: 'Activo' },
  { valor: 'INACTIVO', etiqueta: 'Inactivo' },
];

// Rutas para los diferentes roles
export const RUTAS_POR_ROL = {
  [ROLES.ADMINISTRADOR]: '/admin/dashboard',
  [ROLES.DESARROLLADOR]: '/desarrollador/dashboard',
  [ROLES.ENTIDAD_SALUD]: '/entidad/dashboard',
  [ROLES.MEDICO]: '/medico/dashboard',
  [ROLES.AUXILIAR]: '/auxiliar/dashboard',
  [ROLES.PACIENTE]: '/paciente/dashboard',
  [ROLES.EMBAJADOR]: '/embajador/dashboard',
};

// Antes:


export const GenderOptions = ["Male", "Female", "Other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

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
