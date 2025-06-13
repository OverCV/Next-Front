"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField"
import { Form } from "@/src/components/ui/form"
import { SelectItem } from "@/src/components/ui/select"
import { RUTAS_POR_ROL, TIPOS_IDENTIFICACION, TiposIdentificacionEnum } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"
import { DatosAcceso } from "@/src/types"

import { Alert, AlertDescription } from "../ui/alert"
import { Button } from "../ui/button"



// Esquema de validación
const loginSchema = z.object({
	tipoIdentificacion: z.nativeEnum(TiposIdentificacionEnum, {
		required_error: "Selecciona un tipo de identificación",
	}),
	identificacion: z.string().min(1, "Ingresa tu número de identificación"),
	clave: z.string().min(1, "Ingresa tu contraseña"),
})

// Tipo para los valores del formulario
type AccesoFormValues = z.infer<typeof loginSchema>

export default function AccesoForm(): JSX.Element {
	const router = useRouter()
	const { iniciarSesion } = useAuth()
	const [error, setError] = useState<string | null>(null)
	const [cargando, setCargando] = useState<boolean>(false)
	const [mostrarClave, setMostrarClave] = useState<boolean>(false)

	const form = useForm<AccesoFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			tipoIdentificacion: TiposIdentificacionEnum.CC,
			identificacion: "",
			clave: "",
		},
	})

	const onSubmit = async (datos: AccesoFormValues) => {
		try {
			setCargando(true)
			setError(null)

			const credenciales: DatosAcceso = {
				tipoIdentificacion: datos.tipoIdentificacion,
				identificacion: datos.identificacion,
				clave: datos.clave,
			}

			const usuarioRespuesta = await iniciarSesion(credenciales)

			if (usuarioRespuesta?.rolId) {
				router.push(RUTAS_POR_ROL[usuarioRespuesta.rolId] || "/dashboard/paciente")
			} else {
				setError("Error en la respuesta del servidor")
			}
		} catch (err: any) {
			// Manejar diferentes tipos de errores
			if (err.response?.status === 401) {
				setError("Credenciales incorrectas. Por favor verifica tus datos.")
			} else if (err.response?.status === 404) {
				setError("Usuario no encontrado")
			} else {
				setError("Error al iniciar sesión. Por favor intenta nuevamente.")
			}
		} finally {
			setCargando(false)
		}
	}

	return (
		<div className="flex flex-col items-center justify-center p-4 md:p-8">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
				<div className="items-center space-y-2 text-center">
					<div className="flex items-center justify-center">
						<Image
							src="/assets/images/logo.png"
							width={100}
							height={100}
							alt="Logo"
							className="mr-4 h-auto w-16"
						/>
						<h1 className="text-2xl font-bold">Iniciar Sesión</h1>
					</div>
				</div>
				<p className="my-2 text-sm text-gray-500 dark:text-gray-500">
					Ingresa tus credenciales para acceder
				</p>
				<p className="mb-4 text-xs text-gray-400 dark:text-gray-600">
					Si eres paciente y es tu primer ingreso, tu contraseña es tu número de identificación
				</p>

				{error && (
					<Alert variant="destructive" className="mb-4">
						<AlertCircle className="size-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
						noValidate
					>
						<CustomFormField
							fieldType={FormFieldType.SELECT}
							control={form.control}
							name="tipoIdentificacion"
							label="Tipo de Identificación"
							placeholder="Selecciona tipo"
						>
							{TIPOS_IDENTIFICACION.map((tipo) => (
								<SelectItem key={tipo.valor} value={tipo.valor}>
									{tipo.etiqueta}
								</SelectItem>
							))}
						</CustomFormField>

						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="identificacion"
							label="Número de Identificación"
							placeholder="Ingresa tu número de identificación"
							iconSrc="/assets/icons/user.svg"
							iconAlt="Usuario"
						/>

						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="clave"
							label="Contraseña"
							placeholder="••••••••"
							type="password"
							iconSrc="/assets/icons/lock.svg"
							iconAlt="Contraseña"
							showPassword={mostrarClave}
							onTogglePassword={() => setMostrarClave(!mostrarClave)}
						/>

						<Button
							type="submit"
							className="w-full"
							disabled={cargando}
						>
							{cargando ? "Accediendo..." : "Iniciar Sesión"}
						</Button>

						{/* Enlace para recuperar contraseña */}
						<div className="text-center">
							<Link
								href="/recuperar-contrasena"
								className="text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
							>
								¿Olvidaste tu contraseña?
							</Link>
						</div>
					</form>
				</Form>
			</div>
		</div>
	)
}