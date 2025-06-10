// src\types\index.d.ts

import { TiposIdentificacionEnum } from "../constants";

export interface Triaje {
  id: number;
  pacienteId: number;
  fechaTriaje: string;
  edad: number;
  presionSistolica: number;
  presionDiastolica: number;
  colesterolTotal: number;
  hdl: number;
  tabaquismo: boolean;
  alcoholismo: boolean;
  diabetes: boolean;
  peso: number;
  talla: number;
  imc: number;
  dolorPecho: boolean;
  dolorIrradiado: boolean;
  sudoracion: boolean;
  nauseas: boolean;
  antecedentesCardiacos: boolean;
  resultadoRiesgoCv: number; // 0-1
  descripcion?: string;
  nivelPrioridad: "ALTA" | "MEDIA" | "BAJA";
}

// Interfaz para factores de riesgo
export interface FactorRiesgoModel {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: "SOCIAL" | "AMBIENTAL" | "RACIAL";
}

// Interfaz para datos clínicos
export interface DatoClinico {
  id: number;
  pacienteId: number;
  fechaRegistro: string;
  presionSistolica: number;
  presionDiastolica: number;
  frecuenciaCardiacaMin: number;
  frecuenciaCardiacaMax: number;
  saturacionOxigeno: number;
  temperatura: number;
  peso: number;
  talla: number;
  imc: number;
  observaciones?: string;
}

// Interfaz para localización
export interface Localizacion {
  id: number;
  departamento: string;
  municipio: string;
  vereda?: string;
  localidad?: string;
  latitud?: number;
  longitud?: number;
}

// Interfaz para servicios médicos
export interface ServicioMedicoModel {
  id: number;
  nombre: string;
  descripcion: string;
}

declare type Estatus = "postulada" | "ejecucion" | "finalizada" | "cancelada";

// Interfaz para campañas de salud
export interface CampanaModel {
  id: number;
  nombre: string;
  descripcion: string;
  localizacion?: Localizacion;
  fechaInicio: string;
  fechaLimite: string;
  fechaLimiteInscripcion: string;
  minParticipantes: number;
  maxParticipantes: number;
  entidadId: number;
  estatus: Estatus;
  fechaCreacion: string;
  pacientes?: number; // Número de pacientes inscritos
  servicios?: ServicioMedico[];
  factores?: FactorRiesgo[];
}

// Interfaz para citaciones
export interface Citacion {
  id: number;
  pacienteId: number;
  campanaId: number;
  medicoId: number;
  horaProgramada: string;
  horaAtencion?: string;
  duracionEstimada: number; // en minutos
  estado: "AGENDADA" | "ATENDIDA" | "CANCELADA";
  prediccionAsistencia?: number; // 0-100%
  prioridad: number; // 1-5
  notas?: string;
}

// Interfaces autenticación y usuario
export interface DatosAcceso {
  tipoIdentificacion: TiposIdentificacionEnum;
  identificacion: string;
  clave: string;
}

export interface DatosRegistro {
  tipoIdentificacion: TiposIdentificacionEnum;
  identificacion: string;
  nombres: string;
  apellidos: string;
  correo: string;
  clave: string;
  celular: string;
  estaActivo: boolean;
  rolId: number;
}

export interface Usuario {
  id: number;
  tipoIdentificacion: TiposIdentificacionEnum;
  identificacion: string;
  nombres: string;
  apellidos: string;
  correo: string;
  celular: string;
  estaActivo: boolean;
  rolId: number;
  token?: string;
}

export interface RespuestaAuth {
  usuario: Usuario;
  token: string;
}

// Viejo:

/* eslint-disable no-unused-vars */

// declare type parametrosBusquedaProps = {
//   params: { [key: string]: string };
//   paramsBusqueda: { [key: string]: string | string[] | undefined };
// };

declare type Gender = "Male" | "Female" | "Other";

declare interface CreateUserParams {
  nombres: string;
  apellidos: string;
  email: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

declare type CreateAppointmentParams = {
  userId: string;
  patient: string;
  primaryPhysician: string;
  reason: string;
  schedule: Date;
  status: Estatus;
  note: string | undefined;
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  timeZone: string;
  appointment: Appointment;
  type: string;
};
