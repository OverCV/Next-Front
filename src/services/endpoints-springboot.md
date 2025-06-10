ServiciosMedicos
API para gestión de servicios medicos

GET
/api/servicios-medicos/{id}

PUT
/api/servicios-medicos/{id}

DELETE
/api/servicios-medicos/{id}

GET
/api/servicios-medicos

POST
/api/servicios-medicos

GET
/api/servicios-medicos/paged
Roles
API para gestión de roles

GET
/api/roles/{id}

PUT
/api/roles/{id}

DELETE
/api/roles/{id}

GET
/api/roles

POST
/api/roles

GET
/api/roles/paged

GET
/api/roles/nombre/{nombre}
Buscar rol por nombre
Interacciones con el chatbot
API para gestión de interacciones con el chatbot

GET
/api/interacciones_chatbot/{id}

PUT
/api/interacciones_chatbot/{id}

DELETE
/api/interacciones_chatbot/{id}

GET
/api/interacciones_chatbot

POST
/api/interacciones_chatbot

GET
/api/interacciones_chatbot/seguimiento/{seguimiento_id}
Buscar interacciones de acuerdo a un seguimiento

GET
/api/interacciones_chatbot/seguimiento/{seguimiento_id}/paginado
Buscar seguimientos por atención médica (paginado)

GET
/api/interacciones_chatbot/paged
Prescripciones
API para gestión de prescripciones

GET
/api/prescripciones/{id}

PUT
/api/prescripciones/{id}

DELETE
/api/prescripciones/{id}

GET
/api/prescripciones

POST
/api/prescripciones

GET
/api/prescripciones/paged

GET
/api/prescripciones/diagnostico/{diagnostico_id}
Buscar prescripciones por diagnóstico

GET
/api/prescripciones/diagnostico/{diagnostico_id}/paginado
Buscar prescripciones por diagnóstico (paginado)
ServiciosCampana
API para gestión de servicios campana

GET
/api/servicios-campana/{id}

PUT
/api/servicios-campana/{id}

DELETE
/api/servicios-campana/{id}

GET
/api/servicios-campana

POST
/api/servicios-campana

GET
/api/servicios-campana/servicio/{servicioId}

GET
/api/servicios-campana/paged

GET
/api/servicios-campana/campana/{campanaId}
Triaje
API para gestión de triajes

GET
/api/triaje/{id}

PUT
/api/triaje/{id}

DELETE
/api/triaje/{id}

GET
/api/triaje

POST
/api/triaje

GET
/api/triaje/paged

GET
/api/triaje/paciente/{pacienteId}
Obtener triajes por ID de paciente
Citaciones Médicas
API para gestión de citaciones médicas de pacientes

GET
/api/citaciones-medicas/{id}

PUT
/api/citaciones-medicas/{id}

DELETE
/api/citaciones-medicas/{id}

GET
/api/citaciones-medicas

POST
/api/citaciones-medicas

GET
/api/citaciones-medicas/paged

GET
/api/citaciones-medicas/paciente/{pacienteId}
Buscar citaciones medicas por paciente

GET
/api/citaciones-medicas/medico/{medicoId}
Buscar citaciones medicas por medico

GET
/api/citaciones-medicas/campana/{campanaId}
Buscar citaciones medicas por medico
Embajadores
API para gestión de embajadores de salud

GET
/api/embajadores/{id}

PUT
/api/embajadores/{id}

DELETE
/api/embajadores/{id}

GET
/api/embajadores

POST
/api/embajadores

GET
/api/embajadores/usuario/{usuarioId}

GET
/api/embajadores/paged

GET
/api/embajadores/entidad/{entidadId}
Seguimientos
API para gestión de seguimientos

GET
/api/seguimientos/{id}

PUT
/api/seguimientos/{id}

DELETE
/api/seguimientos/{id}

GET
/api/seguimientos

POST
/api/seguimientos

GET
/api/seguimientos/paged

GET
/api/seguimientos/atencion/{atencion_id}
Buscar seguimientos por atención médica

GET
/api/seguimientos/atencion/{atencion_id}/paginado
Buscar seguimientos por atención médica (paginado)
Localizaciones
API para gestión de localizaciones

GET
/api/localizaciones/{id}

PUT
/api/localizaciones/{id}

DELETE
/api/localizaciones/{id}

GET
/api/localizaciones

POST
/api/localizaciones

GET
/api/localizaciones/paged
Pacientes
API para gestión de pacientes

GET
/api/pacientes/{id}

PUT
/api/pacientes/{id}

DELETE
/api/pacientes/{id}

GET
/api/pacientes

POST
/api/pacientes

GET
/api/pacientes/usuario/{usuarioId}

GET
/api/pacientes/paged

GET
/api/pacientes/localizacion/{localizacionId}
EntidadesSalud
API para gestión de entidades de salud

GET
/api/entidades-salud/{id}

PUT
/api/entidades-salud/{id}

DELETE
/api/entidades-salud/{id}

GET
/api/entidades-salud

POST
/api/entidades-salud

GET
/api/entidades-salud/usuario/{usuarioId}

GET
/api/entidades-salud/paged

GET
/api/entidades-salud/entidad/{razon_social}
Inscripciones a Campañas
API para gestionar inscripciones de pacientes a campañas

GET
/api/inscripciones-campana/{id}

PUT
/api/inscripciones-campana/{id}

DELETE
/api/inscripciones-campana/{id}

PUT
/api/inscripciones-campana/{id}/retirar
Retirar inscripción

GET
/api/inscripciones-campana

POST
/api/inscripciones-campana

GET
/api/inscripciones-campana/paged

GET
/api/inscripciones-campana/paciente/{pacienteId}
Obtener inscripciones por ID de paciente

GET
/api/inscripciones-campana/paciente/{pacienteId}/activas
Obtener inscripciones activas por ID de paciente

GET
/api/inscripciones-campana/campana/{campanaId}
Obtener inscripciones por ID de campaña
Usuarios
API para gestión de usuarios

GET
/api/usuarios/{id}

PUT
/api/usuarios/{id}

DELETE
/api/usuarios/{id}

GET
/api/usuarios

POST
/api/usuarios

GET
/api/usuarios/paged

GET
/api/usuarios/identificacion/{tipo}/{numero}

GET
/api/usuarios/correo/{correo}
Datos Clínicos
API para gestión de datos clínicos de pacientes

GET
/api/datos-clinicos/{id}

PUT
/api/datos-clinicos/{id}

DELETE
/api/datos-clinicos/{id}

GET
/api/datos-clinicos

POST
/api/datos-clinicos

GET
/api/datos-clinicos/paged

GET
/api/datos-clinicos/paciente/{pacienteId}
Buscar datos clínicos por paciente

GET
/api/datos-clinicos/paciente/{pacienteId}/paginado
Buscar datos clínicos por paciente (paginado)
Atenciones Médicas
API para gestión de atenciones médicas

GET
/api/atenciones_medicas/{id}

PUT
/api/atenciones_medicas/{id}

DELETE
/api/atenciones_medicas/{id}

GET
/api/atenciones_medicas

POST
/api/atenciones_medicas

GET
/api/atenciones_medicas/paged

GET
/api/atenciones_medicas/citacion/{citacion_id}
Buscar atención médica por citación
Recomendaciones
API para gestión de recomendaciones

GET
/api/recomendaciones/{id}

PUT
/api/recomendaciones/{id}

DELETE
/api/recomendaciones/{id}

GET
/api/recomendaciones

POST
/api/recomendaciones

GET
/api/recomendaciones/paged

GET
/api/recomendaciones/diagnostico/{diagnostico_id}
Buscar recomendaciones por diagnóstico

GET
/api/recomendaciones/diagnostico/{diagnostico_id}/paginado
Buscar recomendaciones por diagnóstico (paginado)
Historias Clínicas
API para gestión de historias clínicas de pacientes

GET
/api/historias-clinicas/{id}

PUT
/api/historias-clinicas/{id}

DELETE
/api/historias-clinicas/{id}

GET
/api/historias-clinicas

POST
/api/historias-clinicas

GET
/api/historias-clinicas/riesgo-rehospitalizacion
Buscar historias clínicas por riesgo de rehospitalización

GET
/api/historias-clinicas/paged

GET
/api/historias-clinicas/paciente/{pacienteId}
Buscar historias clínicas por paciente

GET
/api/historias-clinicas/paciente/{pacienteId}/paginado
Buscar historias clínicas por paciente (paginado)
Personal Médico
API para gestión de personal médico

GET
/api/personal-medico/{id}

PUT
/api/personal-medico/{id}

DELETE
/api/personal-medico/{id}

GET
/api/personal-medico

POST
/api/personal-medico

GET
/api/personal-medico/usuario/{usuarioId}
Buscar médico por usuario

GET
/api/personal-medico/paged

GET
/api/personal-medico/especialidad/{especialidad}
Buscar médicos por especialidad

GET
/api/personal-medico/entidad/{entidadId}
Buscar médicos por entidad
Diagnósticos
API para gestión de diagnósticos

GET
/api/diagnosticos/{id}

PUT
/api/diagnosticos/{id}

DELETE
/api/diagnosticos/{id}

GET
/api/diagnosticos

POST
/api/diagnosticos

GET
/api/diagnosticos/paged

GET
/api/diagnosticos/codigo_cie10/{codigo_cie10}
Buscar diagnósticos por código CIE 10

GET
/api/diagnosticos/codigo_cie10/{codigo_cie10}/paginado
Buscar diagnósticos por código CIE 10 (paginado)

GET
/api/diagnosticos/atencion/{atencion_id}
Buscar diagnósticos por atención médica

GET
/api/diagnosticos/atencion/{atencion_id}/paginado
Buscar diagnósticos por atención médica (paginado)
Predicciones

GET
/api/predicciones/{id}

PUT
/api/predicciones/{id}

DELETE
/api/predicciones/{id}

GET
/api/predicciones

POST
/api/predicciones

GET
/api/predicciones/paged
Factores de riesgo

GET
/api/factor-riesgo/{id}

PUT
/api/factor-riesgo/{id}

DELETE
/api/factor-riesgo/{id}

GET
/api/factor-riesgo

POST
/api/factor-riesgo

GET
/api/factor-riesgo/tipo/{tipoFactor}

GET
/api/factor-riesgo/paged

GET
/api/factor-riesgo/nombre/{nombreFactor}
Factores paciente

GET
/api/factor-paciente/{id}

PUT
/api/factor-paciente/{id}

DELETE
/api/factor-paciente/{id}

GET
/api/factor-paciente

POST
/api/factor-paciente

GET
/api/factor-paciente/paged
Campaña

GET
/api/campana/{id}

PUT
/api/campana/{id}

DELETE
/api/campana/{id}

GET
/api/campana

POST
/api/campana

GET
/api/campana/paged

GET
/api/campana/fecha-límite

GET
/api/campana/fecha-inicio
Campaña factores

GET
/api/campana-factores/{id}

PUT
/api/campana-factores/{id}

DELETE
/api/campana-factores/{id}

GET
/api/campana-factores

POST
/api/campana-factores

GET
/api/campana-factores/paged
controlador-auth

POST
/api/auth/salir

POST
/api/auth/registro

POST
/api/auth/acceso
health-controller

GET
/healthz

GET
/api/test