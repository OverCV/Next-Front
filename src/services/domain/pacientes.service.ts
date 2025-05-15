export const pacientesService = {
	crearPerfil: async (token: string, datos: {
		fechaNacimiento: Date
		genero: string
		direccion: string
		localizacion_id: number
		usuarioId: number
	}) => {
		try {
			console.log("📝 Creando perfil de paciente:", {
				...datos,
				fechaNacimiento: datos.fechaNacimiento.toISOString().split('T')[0]
			})

			// Usar el endpoint local para evitar problemas con el token
			const response = await fetch("/api/pacientes/perfil", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fechaNacimiento: datos.fechaNacimiento.toISOString().split('T')[0],
					genero: datos.genero,
					direccion: datos.direccion,
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
	}
}