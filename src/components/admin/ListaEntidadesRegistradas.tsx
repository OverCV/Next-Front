"use client"

import { useEffect, useState } from "react"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"
import { ROLES } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"
import { usuariosService } from "@/src/services/domain/usuarios.service"
import { UsuarioAccedido } from "@/src/types"

import { Badge } from "../ui/badge"

export function ListaEntidadesRegistradas() {
    const { usuario } = useAuth()
    const [entidades, setEntidades] = useState<UsuarioAccedido[]>([])
    const [cargando, setCargando] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const cargarEntidades = async () => {
            if (!usuario?.id) {
                setError("No se pudo identificar al administrador.")
                setCargando(false)
                return
            }

            try {
                setCargando(true)
                // Usamos el servicio para obtener todos los usuarios
                const todosLosUsuarios = await usuariosService.obtenerUsuarios()

                // Filtramos según tu lógica: rol de entidad y creados por el admin actual
                const entidadesFiltradas = todosLosUsuarios.filter(
                    (u) => u.rolId === ROLES.ENTIDAD_SALUD && u.creadoPorId === usuario.id
                )

                setEntidades(entidadesFiltradas)
            } catch (err) {
                console.error("Error al cargar entidades:", err)
                setError("No se pudieron cargar las entidades de salud.")
            } finally {
                setCargando(false)
            }
        }

        cargarEntidades()
    }, [usuario])

    if (cargando) {
        return <p className="text-center text-slate-500">Cargando entidades...</p>
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>
    }

    return (
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-semibold">Entidades de Salud Registradas</h3>
            <Table>
                <TableCaption>
                    {entidades.length > 0
                        ? "Listado de entidades de salud que has registrado."
                        : "Aún no has registrado ninguna entidad de salud."}
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Identificación</TableHead>
                        <TableHead>Correo</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entidades.map((entidad) => (
                        <TableRow key={entidad.id}>
                            <TableCell className="font-medium">{`${entidad.nombres} ${entidad.apellidos}`}</TableCell>
                            <TableCell>{entidad.identificacion}</TableCell>
                            <TableCell>{entidad.correo}</TableCell>
                            <TableCell>
                                <Badge variant={entidad.estado === "ACTIVO" ? "default" : "destructive"}>
                                    {entidad.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
} 