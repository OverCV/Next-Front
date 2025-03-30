// "use client";

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';
// import { authService, Usuario } from '@/src/services/auth.service';
// import { ROLES } from '@/constants';

// interface AuthContextType {
//     usuario: Usuario | null;
//     cargando: boolean;
//     estaAutenticado: boolean;
//     login: (tipoIdentificacion: string, identificacion: string, clave: string) => Promise<void>;
//     logout: () => void;
//     esRol: (rolId: number) => boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//     const [usuario, setUsuario] = useState<Usuario | null>(null);
//     const [cargando, setCargando] = useState(true);
//     const router = useRouter();

//     // Verificar autenticación al cargar la aplicación
//     useEffect(() => {
//         const verificarAuth = () => {
//             const usuarioActual = authService.getUsuarioActual();
//             setUsuario(usuarioActual);
//             setCargando(false);
//         };

//         verificarAuth();
//     }, []);

//     // Función de login
//     const login = async (tipoIdentificacion: string, identificacion: string, clave: string) => {
//         try {
//             setCargando(true);
//             const respuesta = await authService.acceso({ tipoIdentificacion, identificacion, clave });
//             setUsuario(respuesta.usuario);
//         } finally {
//             setCargando(false);
//         }
//     };

//     // Función de logout
//     const logout = () => {
//         authService.salir();
//         setUsuario(null);
//         router.push('/auth/login');
//     };

//     // Verificar si el usuario tiene un rol específico
//     const esRol = (rolId: number) => {
//         return usuario?.rolId === rolId;
//     };

//     // Comprobar si el usuario está autenticado
//     const estaAutenticado = !!usuario;

//     const value = {
//         usuario,
//         cargando,
//         estaAutenticado,
//         login,
//         logout,
//         esRol
//     };

//     return <AuthContext.Provider value={ value }> { children } </AuthContext.Provider>;
// }

// // Hook personalizado para usar el contexto de autenticación
// export function useAuth() {
//     const context = useContext(AuthContext);
//     if (context === undefined) {
//         throw new Error('useAuth debe ser usado dentro de un AuthProvider');
//     }
//     return context;
// }