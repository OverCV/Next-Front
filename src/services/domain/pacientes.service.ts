export const pacientesService = {
	crearPerfil: async (token: string, datos: {
		fechaNacimiento: Date
		genero: string
		direccion: string
		tipoSangre: string
		localizacion_id: number
		usuarioId: number
	}) => {
		try {
			console.log("📝 Creando perfil de paciente:", {
				...datos,
				fechaNacimiento: datos.fechaNacimiento.toISOString().split('T')[0]
			})

			// Usar el endpoint local para evitar problemas con el token
			const response = await fetch("/api/pacientes", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fechaNacimiento: datos.fechaNacimiento.toISOString().split('T')[0],
					genero: datos.genero,
					direccion: datos.direccion,
					tipoSangre: datos.tipoSangre,
					localizacionId: datos.localizacion_id,
					usuarioId: datos.usuarioId,
					token // Pasamos el token para que el endpoint lo use
				})
			})

			const data = await response.json()
			console.log("✅ Perfil creado:", data)
			return data
		} catch (error) {
			console.error("❌ Error al crear perfil:", error)
			throw error
		}
	},

	obtenerPerfilPorUsuarioId: async (usuarioId: number) => {
		try {
			console.log("🔍 Obteniendo perfil de paciente para usuario:", usuarioId)

			// Usar el endpoint local para evitar problemas con el token
			const response = await fetch(`/api/pacientes/perfil?usuarioId=${usuarioId}`)
			const data = await response.json()

			console.log("✅ Perfil obtenido:", data)
			return data
		} catch (error) {
			console.error("❌ Error al obtener perfil:", error)
			throw error
		}
	},

	crearTriaje: async (token: string, datos: {
		pacienteId: number
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
		dolorPecho: boolean
		dolorIrradiado: boolean
		sudoracion: boolean
		nauseas: boolean
		antecedentesCardiacos: boolean
		descripcion?: string
	}) => {
		try {
			console.log("📝 Creando triaje para paciente:", datos.pacienteId)

			// Calcular IMC automáticamente
			const talla = datos.talla / 100 // convertir cm a metros
			const imc = Math.round((datos.peso / (talla * talla)) * 10) / 10 // IMC con 1 decimal

			// Usar el endpoint local para evitar problemas con el token
			const response = await fetch("/api/pacientes/triaje", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...datos,
					fechaTriaje: new Date().toISOString().split('T')[0],
					imc,
					nivelPrioridad: "MEDIA", // Por defecto asignamos prioridad MEDIA
					token // Pasamos el token para que el endpoint lo use
				})
			})

			const data = await response.json()
			console.log("✅ Triaje creado:", data)
			return data
		} catch (error) {
			console.error("❌ Error al crear triaje:", error)
			throw error
		}
	}
}