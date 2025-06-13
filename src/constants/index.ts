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

export const TIPOS_IDENTIFICACION_USUARIO: TipoIdentificacion[] = [
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

export enum EstadoUsuarioEnum {
  ACTIVO = "ACTIVO",
  INACTIVO = "INACTIVO",
  SUSPENDIDO = "SUSPENDIDO",
  PENDIENTE = "PENDIENTE",
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
