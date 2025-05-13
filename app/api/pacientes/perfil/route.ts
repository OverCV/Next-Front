import { NextResponse } from "next/server";

import apiClient from "@/src/services/api";

export async function POST(request: Request) {
	try {
		const datos = await request.json();

		// Llamar al backend para crear el perfil del paciente
		const response = await apiClient.post("/pacientes/perfil", datos);

		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error("Error al crear perfil del paciente:", error);

		return NextResponse.json(
			{ error: "Error al crear el perfil del paciente" },
			{ status: error.response?.status || 500 }
		);
	}
} 