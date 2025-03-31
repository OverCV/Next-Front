// src/app/dashboard/desarrollador/page.tsx

export default function DesarrolladorPage() {
    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h2 className="mb-4 text-xl font-semibold">Panel del Desarrollador</h2>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                        <h3 className="mb-2 font-medium">Herramientas de Diagnóstico</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Accede a logs y herramientas de monitoreo
                        </p>
                    </div>

                    <div className="rounded-md bg-purple-50 p-4 dark:bg-purple-900/20">
                        <h3 className="mb-2 font-medium">API y Servicios</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Gestiona endpoints y servicios del sistema
                        </p>
                    </div>

                    <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                        <h3 className="mb-2 font-medium">Modelos de IA</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Administra los modelos de predicción y análisis
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h2 className="mb-4 text-xl font-semibold">Estadísticas del Sistema</h2>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Usuarios Registrados</p>
                        <p className="text-2xl font-bold">1,245</p>
                    </div>

                    <div className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Campañas Activas</p>
                        <p className="text-2xl font-bold">32</p>
                    </div>

                    <div className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Predicciones Realizadas</p>
                        <p className="text-2xl font-bold">3,892</p>
                    </div>
                </div>
            </div>
        </div>
    );
}