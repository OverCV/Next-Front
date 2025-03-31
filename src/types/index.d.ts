// src\types\index.d.ts

// Interfaces
export interface DatosAcceso {
  tipoIdentificacion: string;
  identificacion: string;
  clave: string;
}

export interface DatosRegistro {
  tipoIdentificacion: string;
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
  tipoIdentificacion: string;
  identificacion: string;
  nombres: string;
  apellidos: string;
  correo: string;
  celular: string;
  estaActivo: boolean;
  rolId: number;
}

export interface RespuestaAuth {
  usuario: Usuario;
  token: string;
}

declare type parametrosBusquedaProps = {
  params: { [key: string]: string };
  paramsBusqueda: { [key: string]: string | string[] | undefined };
};

declare type Estatus = "postulada" | "ejecucion" | "cancelada";

// Viejo:

/* eslint-disable no-unused-vars */

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
