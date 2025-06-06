/* eslint-disable no-unused-vars */
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
}

export const ROLES_NOMBRE: Record<number, string> = {
  [ROLES.ADMINISTRADOR]: "Administrador",
  [ROLES.DESARROLLADOR]: "Desarrollador",
  [ROLES.ENTIDAD_SALUD]: "Entidad de Salud",
  [ROLES.MEDICO]: "Médico",
  [ROLES.AUXILIAR]: "Auxiliar",
  [ROLES.PACIENTE]: "Paciente",
  [ROLES.EMBAJADOR]: "Embajador",
}


// Rutas para redirección según rol
export const RUTAS_POR_ROL: Record<number, string> = {
  [ROLES.ADMINISTRADOR]: "/admin",
  [ROLES.DESARROLLADOR]: "/dashboard/desarrollador",
  [ROLES.ENTIDAD_SALUD]: "/dashboard/entidad",
  [ROLES.MEDICO]: "/dashboard/medico",
  [ROLES.AUXILIAR]: "/dashboard/auxiliar",
  [ROLES.PACIENTE]: "/dashboard/paciente",
  [ROLES.EMBAJADOR]: "/dashboard/embajador",
}

// Tipos de identificación
export enum TiposIdentificacionEnum {
  CC = "CC",
  TI = "TI",
  NIT = "NIT",
  RCN = "RCN",
}

export interface TipoIdentificacion {
  valor: TiposIdentificacionEnum
  etiqueta: string
}

export const TIPOS_IDENTIFICACION: TipoIdentificacion[] = [
  { valor: TiposIdentificacionEnum.CC, etiqueta: "Cédula de Ciudadanía" },
  { valor: TiposIdentificacionEnum.TI, etiqueta: "Tarjeta de Identidad" },
  { valor: TiposIdentificacionEnum.NIT, etiqueta: "NIT" },
  { valor: TiposIdentificacionEnum.RCN, etiqueta: "Registro Civil de Nacimiento" },
]

export const TIPOS_IDENTIFICACION_PACIENTE: TipoIdentificacion[] = [
  { valor: TiposIdentificacionEnum.CC, etiqueta: "Cédula de Ciudadanía" },
  { valor: TiposIdentificacionEnum.TI, etiqueta: "Tarjeta de Identidad" },
  { valor: TiposIdentificacionEnum.RCN, etiqueta: "Registro Civil de Nacimiento" },
]

// Estados de campaña
export const ESTADOS_CAMPANA: Record<string, string> = {
  POSTULADA: "POSTULADA",
  EJECUCION: "EJECUCION",
  FINALIZADA: "FINALIZADA",
}

// Opciones de género
export interface OpcionGenero {
  valor: string
  etiqueta: string
}

export enum GeneroBiologicoEnum {
  MASCULINO = 'MASCULINO',
  FEMENINO = 'FEMENINO',
}

export const OPCIONES_GENERO: OpcionGenero[] = [
  { valor: GeneroBiologicoEnum.MASCULINO, etiqueta: "Masculino" },
  { valor: GeneroBiologicoEnum.FEMENINO, etiqueta: "Femenino" },
]

// Tipos de sangre (según backend enum)
export enum TipoSangreEnum {
  A_POSITIVO = "A_POSITIVO",
  A_NEGATIVO = "A_NEGATIVO",
  B_POSITIVO = "B_POSITIVO",
  B_NEGATIVO = "B_NEGATIVO",
  AB_POSITIVO = "AB_POSITIVO",
  AB_NEGATIVO = "AB_NEGATIVO",
  O_POSITIVO = "O_POSITIVO",
  O_NEGATIVO = "O_NEGATIVO"
}

export interface OpcionTipoSangre {
  valor: TipoSangreEnum
  etiqueta: string
}

export const TIPOS_SANGRE: OpcionTipoSangre[] = [
  { valor: TipoSangreEnum.A_POSITIVO, etiqueta: "A+" },
  { valor: TipoSangreEnum.A_NEGATIVO, etiqueta: "A-" },
  { valor: TipoSangreEnum.B_POSITIVO, etiqueta: "B+" },
  { valor: TipoSangreEnum.B_NEGATIVO, etiqueta: "B-" },
  { valor: TipoSangreEnum.AB_POSITIVO, etiqueta: "AB+" },
  { valor: TipoSangreEnum.AB_NEGATIVO, etiqueta: "AB-" },
  { valor: TipoSangreEnum.O_POSITIVO, etiqueta: "O+" },
  { valor: TipoSangreEnum.O_NEGATIVO, etiqueta: "O-" },
]

// Niveles de prioridad
export interface NivelPrioridad {
  valor: string
  etiqueta: string
}

export const NIVELES_PRIORIDAD: NivelPrioridad[] = [
  { valor: "ALTA", etiqueta: "Alta" },
  { valor: "MEDIA", etiqueta: "Media" },
  { valor: "BAJA", etiqueta: "Baja" },
]


export const StatusIcon = {
  postulada: "/assets/icons/postulada.svg",
  ejecucion: "/assets/icons/ambulancia.svg",
  finalizada: "/assets/icons/activa.svg",
  cancelada: "/assets/icons/cancelada.svg",
}

// Simulación de datos
export const PACIENTES_MOCK = [
  { id: 1, nombres: 'Juan', apellidos: 'Pérez', identificacion: '1234567890', fecha: '2023-03-28' },
  { id: 2, nombres: 'María', apellidos: 'López', identificacion: '0987654321', fecha: '2023-03-27' },
  { id: 3, nombres: 'Carlos', apellidos: 'González', identificacion: '5678901234', fecha: '2023-03-26' },
  { id: 4, nombres: 'Ana', apellidos: 'Martínez', identificacion: '4321098765', fecha: '2023-03-25' },
]

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
]

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
]
