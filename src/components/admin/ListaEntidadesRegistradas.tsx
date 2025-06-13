"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight, Edit, Eye, MoreVertical, Trash2 } from "lucide-react"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/src/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { ROLES } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"
import { usuariosService } from "@/src/services/domain/usuarios.service"
import { entidadSaludService } from "@/src/services/domain/entidad-salud.service"
import { CampanaService } from "@/src/services/domain/campana.service"
import { UsuarioAccedido, EntidadSalud, Campana, EstadoCampana } from "@/src/types"
import { ModalEditarEntidad } from "./ModalEditarEntidad"

interface EntidadCompleta {
    usuario: UsuarioAccedido
    entidadSalud?: EntidadSalud
    campanas: {
        activas: Campana[]
        postuladas: Campana[]
        finalizadas: Campana[]
    }
}

export function ListaEntidadesRegistradas() {
    const { usuario } = useAuth()
    const [entidades, setEntidades] = useState<EntidadCompleta[]>([])
    const [cargando, setCargando] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [entidadesExpandidas, setEntidadesExpandidas] = useState<Set<number>>(new Set())
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false)
    const [entidadSeleccionada, setEntidadSeleccionada] = useState<EntidadCompleta | null>(null)

    useEffect(() => {
        const cargarEntidades = async () => {
            if (!usuario?.id) {
                setError("No se pudo identificar al administrador.")
                setCargando(false)
                return
            }

            try {
                setCargando(true)
                setError(null)
                
                // Obtener todos los usuarios
                const todosLosUsuarios = await usuariosService.obtenerUsuarios()
                
                // Filtrar entidades de salud creadas por el admin actual
                const entidadesFiltradas = todosLosUsuarios.filter(
                    (u) => u.rolId === ROLES.ENTIDAD_SALUD && u.creadoPorId === usuario.id
                )

                // Para cada entidad, obtener sus datos completos y campañas
                const entidadesCompletas = await Promise.all(
                    entidadesFiltradas.map(async (entidadUsuario) => {
                        try {
                            // Obtener datos de la entidad de salud
                            let entidadSalud: EntidadSalud | undefined
                            try {
                                entidadSalud = await entidadSaludService.obtenerEntidadPorUsuarioId(entidadUsuario.id)
                            } catch (err) {
                                console.warn(`No se pudo obtener entidad de salud para usuario ${entidadUsuario.id}:`, err)
                            }

                            // Obtener campañas de la entidad
                            let campanas: Campana[] = []
                            if (entidadSalud?.id) {
                                try {
                                    campanas = await CampanaService.obtenerCampanasPorEntidad(entidadSalud.id)
                                } catch (err) {
                                    console.warn(`No se pudieron obtener campañas para entidad ${entidadSalud.id}:`, err)
                                }
                            }

                            // Clasificar campañas por estado
                            const campanasClasificadas = {
                                activas: campanas.filter(c => c.estado === EstadoCampana.EJECUCION),
                                postuladas: campanas.filter(c => c.estado === EstadoCampana.POSTULADA),
                                finalizadas: campanas.filter(c => c.estado === EstadoCampana.FINALIZADA)
                            }

                            return {
                                usuario: entidadUsuario,
                                entidadSalud,
                                campanas: campanasClasificadas
                            }
                        } catch (err) {
                            console.error(`Error al procesar entidad ${entidadUsuario.id}:`, err)
                            return {
                                usuario: entidadUsuario,
                                entidadSalud: undefined,
                                campanas: { activas: [], postuladas: [], finalizadas: [] }
                            }
                        }
                    })
                )

                setEntidades(entidadesCompletas)
            } catch (err) {
                console.error("Error al cargar entidades:", err)
                setError("No se pudieron cargar las entidades de salud.")
            } finally {
                setCargando(false)
            }
        }

        cargarEntidades()
    }, [usuario])

    const toggleEntidadExpandida = (entidadId: number) => {
        const nuevasExpandidas = new Set(entidadesExpandidas)
        if (nuevasExpandidas.has(entidadId)) {
            nuevasExpandidas.delete(entidadId)
        } else {
            nuevasExpandidas.add(entidadId)
        }
        setEntidadesExpandidas(nuevasExpandidas)
    }

    const cambiarEstadoEntidad = async (entidadId: number, nuevoEstado: string) => {
        try {
            await usuariosService.cambiarEstadoUsuario(entidadId, nuevoEstado)
            
            // Actualizar el estado local
            setEntidades(prevEntidades => 
                prevEntidades.map(entidad => 
                    entidad.usuario.id === entidadId 
                        ? { ...entidad, usuario: { ...entidad.usuario, estado: nuevoEstado } }
                        : entidad
                )
            )
        } catch (error) {
            console.error("Error al cambiar estado de entidad:", error)
            setError("No se pudo cambiar el estado de la entidad")
        }
    }

    const getBadgeVariant = (estado: string) => {
        switch (estado) {
            case "ACTIVO":
                return "default"
            case "INACTIVO":
                return "secondary"
            case "SUSPENDIDO":
                return "destructive"
            case "PENDIENTE":
                return "outline"
            default:
                return "secondary"
        }
    }

    const getEstadoLabel = (estado: string) => {
        switch (estado) {
            case "ACTIVO":
                return "Activo"
            case "INACTIVO":
                return "Inactivo"
            case "SUSPENDIDO":
                return "Suspendido"
            case "PENDIENTE":
                return "Pendiente"
            default:
                return estado
        }
    }

    const abrirModalEditar = (entidad: EntidadCompleta) => {
        setEntidadSeleccionada(entidad)
        setModalEditarAbierto(true)
    }

    const cerrarModalEditar = () => {
        setModalEditarAbierto(false)
        setEntidadSeleccionada(null)
    }

    const actualizarEntidad = (usuarioActualizado: UsuarioAccedido) => {
        setEntidades(prevEntidades => 
            prevEntidades.map(entidad => 
                entidad.usuario.id === usuarioActualizado.id 
                    ? { ...entidad, usuario: usuarioActualizado }
                    : entidad
            )
        )
    }

    if (cargando) {
        return <p className="text-center text-slate-500">Cargando entidades...</p>
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>
    }

    return (
        <div className="mt-8 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Entidades de Salud Registradas</CardTitle>
                </CardHeader>
                <CardContent>
                    {entidades.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">
                            Aún no has registrado ninguna entidad de salud.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {entidades.map((entidad) => (
                                <div key={entidad.usuario.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleEntidadExpandida(entidad.usuario.id)}
                                            >
                                                {entidadesExpandidas.has(entidad.usuario.id) ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <div>
                                                <h3 className="font-semibold">
                                                    {entidad.entidadSalud?.razonSocial || `${entidad.usuario.nombres} ${entidad.usuario.apellidos}`}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    {entidad.usuario.identificacion} • {entidad.usuario.correo}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            <div className="flex space-x-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {entidad.campanas.postuladas.length} Postuladas
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {entidad.campanas.activas.length} Activas
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {entidad.campanas.finalizadas.length} Finalizadas
                                                </Badge>
                                            </div>
                                            
                                            <Select
                                                value={entidad.usuario.estado}
                                                onValueChange={(valor) => cambiarEstadoEntidad(entidad.usuario.id, valor)}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <Badge variant={getBadgeVariant(entidad.usuario.estado)}>
                                                        {getEstadoLabel(entidad.usuario.estado)}
                                                    </Badge>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVO">Activo</SelectItem>
                                                    <SelectItem value="INACTIVO">Inactivo</SelectItem>
                                                    <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
                                                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => abrirModalEditar(entidad)}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Editar Datos
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toggleEntidadExpandida(entidad.usuario.id)}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        {entidadesExpandidas.has(entidad.usuario.id) ? "Ocultar Detalles" : "Ver Detalles"}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    {entidadesExpandidas.has(entidad.usuario.id) && (
                                        <div className="mt-4 space-y-4">
                                            {/* Información de la entidad */}
                                            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-sm text-slate-700">Información de Usuario</h4>
                                                    <div className="mt-2 space-y-1 text-sm">
                                                        <p><span className="font-medium">Tipo ID:</span> {entidad.usuario.tipoIdentificacion}</p>
                                                        <p><span className="font-medium">Identificación:</span> {entidad.usuario.identificacion}</p>
                                                        <p><span className="font-medium">Correo:</span> {entidad.usuario.correo}</p>
                                                        <p><span className="font-medium">Celular:</span> {entidad.usuario.celular}</p>
                                                    </div>
                                                </div>
                                                {entidad.entidadSalud && (
                                                    <div>
                                                        <h4 className="font-medium text-sm text-slate-700">Datos de la Entidad</h4>
                                                        <div className="mt-2 space-y-1 text-sm">
                                                            <p><span className="font-medium">Razón Social:</span> {entidad.entidadSalud.razonSocial}</p>
                                                            <p><span className="font-medium">Dirección:</span> {entidad.entidadSalud.direccion}</p>
                                                            <p><span className="font-medium">Teléfono:</span> {entidad.entidadSalud.telefono}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Campañas */}
                                            <div className="space-y-4">
                                                {/* Campañas Postuladas */}
                                                {entidad.campanas.postuladas.length > 0 && (
                                                    <div>
                                                        <h4 className="font-medium text-sm text-slate-700 mb-2">Campañas Postuladas ({entidad.campanas.postuladas.length})</h4>
                                                        <div className="space-y-2">
                                                            {entidad.campanas.postuladas.map((campana) => (
                                                                <div key={campana.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                                                                    <div>
                                                                        <p className="font-medium text-sm">{campana.nombre}</p>
                                                                        <p className="text-xs text-slate-500">Fecha inicio: {new Date(campana.fechaInicio).toLocaleDateString()}</p>
                                                                    </div>
                                                                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Postulada</Badge>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Campañas Activas */}
                                                {entidad.campanas.activas.length > 0 && (
                                                    <div>
                                                        <h4 className="font-medium text-sm text-slate-700 mb-2">Campañas Activas ({entidad.campanas.activas.length})</h4>
                                                        <div className="space-y-2">
                                                            {entidad.campanas.activas.map((campana) => (
                                                                <div key={campana.id} className="flex justify-between items-center p-2 bg-green-50 rounded border-l-4 border-green-400">
                                                                    <div>
                                                                        <p className="font-medium text-sm">{campana.nombre}</p>
                                                                        <p className="text-xs text-slate-500">Fecha inicio: {new Date(campana.fechaInicio).toLocaleDateString()}</p>
                                                                    </div>
                                                                    <Badge variant="outline" className="bg-green-100 text-green-800">Activa</Badge>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Campañas Finalizadas */}
                                                {entidad.campanas.finalizadas.length > 0 && (
                                                    <div>
                                                        <h4 className="font-medium text-sm text-slate-700 mb-2">Campañas Finalizadas ({entidad.campanas.finalizadas.length})</h4>
                                                        <div className="space-y-2">
                                                            {entidad.campanas.finalizadas.map((campana) => (
                                                                <div key={campana.id} className="flex justify-between items-center p-2 bg-slate-50 rounded border-l-4 border-slate-400">
                                                                    <div>
                                                                        <p className="font-medium text-sm">{campana.nombre}</p>
                                                                        <p className="text-xs text-slate-500">Fecha inicio: {new Date(campana.fechaInicio).toLocaleDateString()}</p>
                                                                    </div>
                                                                    <Badge variant="outline" className="bg-slate-100 text-slate-800">Finalizada</Badge>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Mensaje cuando no hay campañas */}
                                                {entidad.campanas.postuladas.length === 0 && 
                                                 entidad.campanas.activas.length === 0 && 
                                                 entidad.campanas.finalizadas.length === 0 && (
                                                    <p className="text-center text-slate-500 py-4 text-sm">
                                                        Esta entidad no tiene campañas registradas.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de edición */}
            {entidadSeleccionada && (
                <ModalEditarEntidad
                    abierto={modalEditarAbierto}
                    onCerrar={cerrarModalEditar}
                    usuario={entidadSeleccionada.usuario}
                    entidadSalud={entidadSeleccionada.entidadSalud}
                    onActualizar={actualizarEntidad}
                />
            )}
        </div>
    )
} 