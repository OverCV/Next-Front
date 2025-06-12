// src\types\index.d.ts

import { TiposIdentificacionEnum } from "../constants"

export interface Triaje {
  id: number
  pacienteId: number
  fechaTriaje: string
  edad: number
  presionSistolica: number
  presionDiastolica: number
  colesterolTotal: number
  hdl: number
  tabaquismo: boolean
  alcoholismo: boolean
  diabetes: boolean
  peso: number
  talla: number
  imc: number
  dolorPecho: boolean
  dolorIrradiado: boolean
  sudoracion: boolean
  nauseas: boolean
  antecedentesCardiacos: boolean
  resultadoRiesgoCv: number // 0-1
  descripcion?: string
  nivelPrioridad: "ALTA" | "MEDIA" | "BAJA"
}

// Interfaz para factores de riesgo
export interface FactorRiesgo {
  id: number
  nombre: string
  descripcion: string
  tipo: "SOCIAL" | "AMBIENTAL" | "RACIAL"
}

// Interfaz para datos clínicos
export interface DatoClinico {
  id: number
  pacienteId: number
  fechaRegistro: string
  presionSistolica: number
  presionDiastolica: number
  frecuenciaCardiacaMin: number
  frecuenciaCardiacaMax: number
  saturacionOxigeno: number
  temperatura: number
  peso: number
  talla: number
  imc: number
  observaciones?: string
}

// Interfaz para localización
export interface Localizacion {
  id: number
  departamento: string
  municipio: string
  vereda?: string
  localidad?: string
  latitud?: number
  longitud?: number
}

// Interfaz para servicios médicos
export interface ServicioMedico {
  id: number
  nombre: string
  descripcion: string
}

export enum EstadoCampana {
  POSTULADA = "POSTULADA",
  EJECUCION = "EJECUCION",
  FINALIZADA = "FINALIZADA",
  CANCELADA = "CANCELADA"
}

// Interfaz para campañas de salud
export interface Campana {
  id: number
  nombre: string
  descripcion: string
  localizacion?: Localizacion
  fechaInicio: string
  fechaLimite: string
  fechaLimiteInscripcion: string
  minParticipantes: number
  maxParticipantes: number
  entidadId: number
  estado: EstadoCampana
  fechaCreacion: string
  pacientes?: number
  servicios?: ServicioMedico[]
  factores?: FactorRiesgo[]
}

// Estados de citaciones médicas
export enum EstadoCitacion {
  AGENDADA = "AGENDADA",
  ATENDIDA = "ATENDIDA",
  CANCELADA = "CANCELADA",
}


// Interfaz para citaciones médicas
export interface Citacion {
  id: number
  pacienteId: number
  campanaId: number
  medicoId: number
  horaProgramada: string
  horaAtencion?: string
  duracionEstimada: number // en minutos
  estado: EstadoCitacion
  prediccionAsistencia: number // 0-100%
  codigoTicket: string
  notas?: string
}

// Estados de atención médica
export enum EstadoAtencion {
  EN_PROCESO = "EN_PROCESO",
  COMPLETADA = "COMPLETADA",
  CANCELADA = "CANCELADA"
}

// Interfaz para atenciones médicas
export interface AtencionMedica {
  id: number
  citacionId: number
  fechaHoraInicio: string
  fechaHoraFin?: string
  duracionReal?: number // en minutos
  estado: EstadoAtencion
}

// Datos para crear atención médica
export interface CrearAtencionMedica {
  citacionId: number
  fechaHoraInicio: string
  estado: EstadoAtencion
}

// Interfaz para datos clínicos (para médicos)
export interface DatoClinicoMedico {
  id?: number
  pacienteId: number
  presionSistolica: number
  presionDiastolica: number
  frecuenciaCardiacaMin: number
  frecuenciaCardiacaMax: number
  saturacionOxigeno: number
  temperatura: number
  colesterolTotal: number
  hdl: number
  observaciones?: string
  fechaMedicion: string
}

// Interfaz para inscripciones a campañas
export interface InscripcionCampana {
  id: number
  pacienteId: number
  campanaId: number
  fechaInscripcion: string
  estado: "INSCRITO" | "RETIRADO" | "COMPLETADO"
  motivoRetiro?: string
}

// Datos para crear inscripción
export interface CrearInscripcionCampana {
  usuarioId: number
  campanaId: number
}

export interface EntidadSalud {
  id?: number
  razonSocial: string
  direccion: string
  telefono: string
  correo: string
  usuarioId: number
}

export interface Embajador {
  id?: number
  nombreCompleto: string
  telefono: string
  usuarioId: number
  localidad: string
  identificacion: string
  correo: string
}

export interface Medico {
  id?: number
  usuarioId: number
  entidadId: number
  especialidad: string
  // Campos de Usuario (pueden venir en un join)
  nombreCompleto?: string
  identificacion?: string
  correo?: string
  telefono?: string
  // Campos de Entidad (pueden venir en un join)
  entidadSalud?: EntidadSalud
}

export interface EmbajadorEntidad {
  id?: number
  entidadId: number
  embajadorId: number
  entidad: EntidadSalud | null
  embajador: Embajador | null
}

// Interfaces autenticación y usuario
export interface DatosAcceso {
  tipoIdentificacion: TiposIdentificacionEnum
  identificacion: string
  clave: string
}

export interface Usuario extends DatosAcceso {
  nombres: string
  apellidos: string
  correo: string
  celular: string
  estado: string
  rolId: number
}
export interface UsuarioAccedido extends Usuario {
  id: number
  creadoPorId: number
  token?: string
}

export interface RespuestaAuth {
  usuario: UsuarioAccedido
  token: string
}

// Viejo:

/* eslint-disable no-unused-vars */

declare type GeneroBiologico = "MASCULINO" | "FEMENINO"

declare type CreateAppointmentParams = {
  userId: string
  patient: string
  primaryPhysician: string
  reason: string
  schedule: Date
  status: EstadoCampana
  note: string | undefined
}

declare type UpdateAppointmentParams = {
  appointmentId: string
  userId: string
  timeZone: string
  appointment: Appointment
  type: string
}

export interface ServiciosMedicosCampana {
  id?: number
  servicioId: string
  campanaId: string
}

export interface FactoresRiesgoCampana {
  id?: number
  campanaId: number
  factorId: number
}

// Interfaces para Predicciones de Riesgo Cardiovascular
export interface FactorInfluyente {
  [key: string]: number
}

export interface PrediccionRiesgoCV {
  confianza: number
  factores_principales: FactorInfluyente[]
  fecha_prediccion: string
  modelo_version: string
  nivel_riesgo: string
  probabilidad: number
  recomendaciones: string[]
  riesgo: boolean
  valor_prediccion: number
}

export interface PrediccionGuardada {
  id: number
  pacienteId: number
  campanaId: number
  valorPrediccion: number
  confianza: number
  factoresInfluyentes: object
  fechaPrediccion: string
  modeloVersion: string
  tipo: string
  nivelRiesgo: string
  recomendaciones: string[]
  creadoPor: string
  actualizadoPor?: string
  fechaCreacion: string
  fechaActualizacion?: string
}

export interface HealthCheck {
  status: string
  service: string
  version: string
}

// Interfaces para Triajes de Pacientes
export interface TriajePaciente {
  id: number
  pacienteId: number
  edad: number
  actividadFisica: boolean
  peso: number
  estatura: number
  tabaquismo: boolean
  alcoholismo: boolean
  diabetes: boolean
  dolorPecho: boolean
  dolorIrradiado: boolean
  sudoracion: boolean
  nauseas: boolean
  antecedentesCardiacos: boolean
  hipertension: boolean
  fechaTriaje: string
  descripcion?: string
}

// Interfaces para Información de Pacientes y Usuarios
export interface PacienteInfo {
  id: number
  fechaNacimiento: string
  genero: string
  direccion: string
  tipoSangre: string
  localizacionId: number
  usuarioId: number
}

export interface UsuarioInfo {
  id: number
  nombres: string
  apellidos: string
  correo: string
  celular: string
  tipoIdentificacion: string
  identificacion: string
}

export interface PacienteCompleto {
  paciente: PacienteInfo
  usuario: UsuarioInfo
  triajes: TriajePaciente[]
  datosClinicosRecientes: DatoClinico[]
}

// Interfaces para Campañas con Localización
export interface CampanaConLocalizacion {
  id: number
  nombre: string
  descripcion: string
  localizacionId: number
  fechaLimiteInscripcion: string
  fechaInicio: string
  fechaLimite: string
  minParticipantes: number
  maxParticipantes: number
  entidadId: number
  estado: 'POSTULADA' | 'EJECUCION' | 'FINALIZADA' | 'CANCELADA'
  localizacion?: {
    id: number
    departamento: string
    municipio: string
    vereda?: string
    localidad?: string
    latitud: number
    longitud: number
  }
}

export interface InscripcionCompleta {
  inscripcion: InscripcionCampana
  campana: CampanaConLocalizacion
}

// Interfaces para datos de creación y actualización de campañas
export interface CrearCampanaParams {
  nombre: string
  descripcion: string
  fechaInicio: string
  fechaLimite: string
  fechaLimiteInscripcion: string
  estado: string
  minParticipantes: number
  maxParticipantes: number
  localizacionId?: number
  serviciosIds?: number[]
  factoresIds?: number[]
  entidadId: number | null
}

export interface ActualizarCampanaParams {
  id: number
  nombre?: string
  descripcion?: string
  fechaInicio?: string
  fechaLimite?: string
  minParticipantes?: number
  maxParticipantes?: number
  estatus?: string
  localizacionId?: number
  serviciosIds?: number[]
  factoresIds?: number[]
}
