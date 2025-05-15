/**
 * Utilidades para depuración
 */

// Función para simular una petición al endpoint de perfil
export async function testPerfilEndpoint(usuarioId: number) {
	try {
		console.log("🧪 TEST: Probando endpoint de perfil para usuario:", usuarioId);

		const response = await fetch(`/api/pacientes/perfil?usuarioId=${usuarioId}`);
		const data = await response.json();

		console.log("🧪 TEST: Respuesta del endpoint de perfil:", data);
		return data;
	} catch (error) {
		console.error("🧪 TEST: Error al probar endpoint de perfil:", error);
		return null;
	}
}

// Función para simular una petición al endpoint de triaje
export async function testTriajeEndpoint(pacienteId: number) {
	try {
		console.log("🧪 TEST: Probando endpoint de triaje para paciente:", pacienteId);

		const response = await fetch(`/api/pacientes/triaje?pacienteId=${pacienteId}`);
		const data = await response.json();

		console.log("🧪 TEST: Respuesta del endpoint de triaje:", data);
		return data;
	} catch (error) {
		console.error("🧪 TEST: Error al probar endpoint de triaje:", error);
		return null;
	}
}

// Función para verificar el estado del token
export function checkTokenStatus() {
	try {
		const token = localStorage.getItem('token') || document.cookie.match(/token=([^;]+)/)?.[1];

		console.log("🧪 TEST: Estado del token:", {
			exists: !!token,
			value: token ? `${token.substring(0, 15)}...` : 'null',
			localStorage: !!localStorage.getItem('token'),
			cookie: !!document.cookie.match(/token=([^;]+)/)
		});

		return !!token;
	} catch (error) {
		console.error("🧪 TEST: Error al verificar token:", error);
		return false;
	}
}

// Función para verificar el estado del usuario
export function checkUserStatus() {
	try {
		const userStr = localStorage.getItem('usuario');
		const user = userStr ? JSON.parse(userStr) : null;

		console.log("🧪 TEST: Estado del usuario:", {
			exists: !!user,
			id: user?.id,
			rolId: user?.rolId,
			email: user?.email
		});

		return user;
	} catch (error) {
		console.error("🧪 TEST: Error al verificar usuario:", error);
		return null;
	}
}

// Función para probar el flujo completo de perfil y triaje
export async function testFlujoPerfilTriaje(usuarioId: number) {
	console.log("🧪 TEST: Probando flujo completo de perfil y triaje para usuario:", usuarioId);

	// Paso 1: Verificar perfil
	console.log("🧪 TEST: Paso 1 - Verificando perfil");
	const perfilResponse = await fetch(`/api/pacientes/perfil?usuarioId=${usuarioId}`);
	const perfilData = await perfilResponse.json();

	console.log("🧪 TEST: Respuesta de verificación de perfil:", perfilData);
	const tienePerfil = perfilData.existe === true;

	if (!tienePerfil) {
		console.log("🧪 TEST: El usuario no tiene perfil, debería ser redirigido a completar perfil");
		return {
			step: "perfil",
			data: perfilData,
			necesitaCompletarPerfil: true,
			necesitaTriaje: false
		};
	}

	// Paso 2: Verificar triaje (si tiene perfil)
	console.log("🧪 TEST: Paso 2 - Verificando triaje");
	const pacienteId = perfilData.id;

	if (!pacienteId) {
		console.log("🧪 TEST: No se pudo obtener el ID del paciente, verificación de triaje no es posible");
		return {
			step: "error",
			data: perfilData,
			error: "No se pudo obtener ID de paciente"
		};
	}

	const triajeResponse = await fetch(`/api/pacientes/triaje?pacienteId=${pacienteId}`);
	const triajeData = await triajeResponse.json();

	console.log("🧪 TEST: Respuesta de verificación de triaje:", triajeData);
	const tieneTriaje = triajeData.existe === true;

	if (!tieneTriaje) {
		console.log("🧪 TEST: El paciente no tiene triaje, debería ser redirigido a completar triaje");
		return {
			step: "triaje",
			data: { perfil: perfilData, triaje: triajeData },
			necesitaCompletarPerfil: false,
			necesitaTriaje: true
		};
	}

	// Paso 3: Todo completo
	console.log("🧪 TEST: El usuario tiene perfil y triaje completos, debería ir al dashboard");
	return {
		step: "completo",
		data: { perfil: perfilData, triaje: triajeData },
		necesitaCompletarPerfil: false,
		necesitaTriaje: false
	};
}

// Función principal de depuración
export async function runDebugTests() {
	console.log("🧪 TEST: Iniciando pruebas de depuración...");

	const hasToken = checkTokenStatus();
	const user = checkUserStatus();

	if (user && user.id) {
		// Test básico de endpoint
		await testPerfilEndpoint(user.id);

		// Test del flujo completo
		console.log("\n🧪 TEST: Iniciando prueba de flujo completo");
		const flujoResult = await testFlujoPerfilTriaje(user.id);
		console.log("🧪 TEST: Resultado del flujo:", flujoResult);
	} else {
		console.log("🧪 TEST: No se puede probar los endpoints sin usuario");
	}

	console.log("🧪 TEST: Pruebas de depuración completadas");
} 