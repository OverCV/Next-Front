"use client"

import { useAuth } from '@/src/providers/auth-provider'
import { usePacienteDashboard } from '@/src/lib/hooks/usePacienteDashboard'
import { ValidacionSeguimientosAlert } from '@/src/components/pacientes/ValidacionSeguimientosAlert'

export default function PacienteDashboard() {
    const { usuario } = useAuth()
    const { 
        datos, 
        cargando, 
        cargandoPaciente, 
        error, 
        validandoSeguimientos,
        recargarDatos 
    } = usePacienteDashboard(usuario?.id || null)

    if (cargando || cargandoPaciente) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando tu información de salud...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline"> {error}</span>
                        <button 
                            onClick={recargarDatos}
                            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!datos) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center text-gray-600">
                        No se pudieron cargar los datos del paciente.
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        ¡Hola, {datos.paciente.usuario?.nombres || 'Paciente'}! 👋
                    </h1>
                    <p className="text-lg text-gray-600">
                        Bienvenido a tu portal de salud cardiovascular
                    </p>
                </div>

                {/* Componente de validación de seguimientos */}
                <ValidacionSeguimientosAlert validando={validandoSeguimientos} />

                {/* Estadísticas principales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🏥</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Campañas Activas</h3>
                                <p className="text-3xl font-bold text-blue-600">{datos.campanasActivas}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">📋</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Campañas Disponibles</h3>
                                <p className="text-3xl font-bold text-green-600">{datos.campanasDisponibles}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">📊</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Triajes Realizados</h3>
                                <p className="text-3xl font-bold text-purple-600">{datos.triagesRealizados}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seguimientos del Paciente */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <span className="text-3xl mr-3">💊</span>
                            Seguimientos del Paciente
                        </h2>
                        <button 
                            onClick={recargarDatos}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            🔄 Actualizar
                        </button>
                    </div>
                    
                    {validandoSeguimientos && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                                <p className="text-blue-700">Validando seguimientos automáticos...</p>
                            </div>
                        </div>
                    )}

                    <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">Todos los seguimientos cardiovasculares (pendientes y completados)</p>
                    </div>

                    {datos.seguimientos.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="mb-4">
                                <span className="text-6xl">✅</span>
                            </div>
                            <p className="text-gray-600 mb-2">No hay seguimientos registrados</p>
                            <p className="text-sm text-gray-500">Los seguimientos aparecerán aquí cuando se creen</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {datos.seguimientos.map((seguimiento) => (
                                <div key={seguimiento.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{seguimiento.tipo}</h4>
                                            <p className="text-sm text-gray-600">
                                                Programado: {new Date(seguimiento.fecha_programada).toLocaleDateString()}
                                            </p>
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                                seguimiento.estado === 'COMPLETADO' ? 'bg-green-100 text-green-800' :
                                                seguimiento.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {seguimiento.estado}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-sm font-medium ${
                                                seguimiento.prioridad === 'ALTA' ? 'text-red-600' :
                                                seguimiento.prioridad === 'MEDIA' ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>
                                                {seguimiento.prioridad}
                                            </span>
                                        </div>
                                    </div>
                                    {seguimiento.notas && (
                                        <p className="mt-2 text-sm text-gray-700">{seguimiento.notas}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mis Campañas de Salud */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="text-3xl mr-3">🏥</span>
                        Mis Campañas de Salud
                    </h2>
                    
                    <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">Campañas en las que estás registrado actualmente</p>
                    </div>

                    {datos.campanas.length === 0 ? (
                        <div className="text-center py-8">
                            <span className="text-6xl mb-4 block">📋</span>
                            <p className="text-gray-600 mb-2">No estás inscrito en ninguna campaña</p>
                            <p className="text-sm text-gray-500">Las campañas aparecerán aquí cuando te inscribas</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {datos.campanas.map((campana) => (
                                <div key={campana.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <h3 className="font-semibold text-gray-900 mb-2">{campana.nombre}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{campana.descripcion}</p>
                                    <div className="space-y-1 text-xs text-gray-500">
                                        <p>📅 Inicio: {new Date(campana.fecha_inicio).toLocaleDateString()}</p>
                                        <p>⏰ Límite: {new Date(campana.fecha_limite).toLocaleDateString()}</p>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                            campana.estado === 'ACTIVA' ? 'bg-green-100 text-green-800' :
                                            campana.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {campana.estado}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Historial de Citaciones */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="text-3xl mr-3">📋</span>
                        Historial de Citaciones
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Campaña Menorcitos</h3>
                                    <p className="text-sm text-gray-600">11/06/2025 a las 17:03</p>
                                </div>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                    Atendida
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}