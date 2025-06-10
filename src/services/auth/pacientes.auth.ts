import { pacientesService } from "../domain/pacientes.service"

/**
 * Servicio de compatibilidad que redirige a la lógica consolidada
 * @deprecated Usar pacientesService directamente
 */
export const pacientesAuthService = {
  /**
   * @deprecated Usar pacientesService.verificarPaciente en su lugar
   */
  verificarPaciente: pacientesService.verificarPaciente,

  /**
   * @deprecated Usar pacientesService.verificarTriaje en su lugar
   */
  verificarTriaje: pacientesService.verificarTriaje,

  /**
   * @deprecated Usar pacientesService.verificarEstadoCompleto en su lugar
   */
  verificarEstadoCompleto: pacientesService.verificarEstadoCompleto
}