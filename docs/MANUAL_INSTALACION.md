# Manual de Instalación - Sistema de Seguimientos Automáticos

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)
- Git

## Pasos de Instalación



### 1. Clonar el Repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd Next-Front
```

### 2. Instalar Dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias listadas en el `package.json`, incluyendo:
- Next.js 14.2.3
- React 18
- TailwindCSS
- Radix UI Components
- Y otras dependencias necesarias

### 3. Configuración del Entorno

1. Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# API y Endpoint
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_ENDPOINT=
NEXT_PUBLIC_PASSKEY=

# Twilio (SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Nodemailer (Correos)
EMAIL_SERVICE=
EMAIL_USER=
EMAIL_PASSWORD=

# Appwrite/Sentry/Otros
PROJECT_ID=
API_KEY=
NEXT_PUBLIC_BUCKET_ID=
```

### 4. Ejecutar el Proyecto

Para desarrollo local:
```bash
npm run dev
```

Para producción:
```bash
npm run build
npm start
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta el linter para verificar el código

## Estructura del Proyecto

```
Next-Front/
├── app/              # Directorio principal de la aplicación
├── public/           # Archivos estáticos
├── src/             # Código fuente
├── docs/            # Documentación
└── components/      # Componentes reutilizables
```

## Solución de Problemas Comunes

### Error de Dependencias
Si encuentras errores al instalar dependencias:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Error de Compilación
Si hay errores de compilación:
1. Verifica que todas las variables de entorno estén configuradas
2. Ejecuta `npm run lint` para identificar problemas de código
3. Asegúrate de tener la versión correcta de Node.js

## Soporte

Para reportar problemas o solicitar ayuda:
1. Revisa la documentación existente en la carpeta `docs/`
2. Abre un issue en el repositorio del proyecto
3. Contacta al equipo de desarrollo

## Notas Adicionales

- El proyecto utiliza TypeScript para un mejor desarrollo y mantenimiento
- Se implementa TailwindCSS para los estilos
- Se utiliza Radix UI para componentes accesibles
- El proyecto incluye configuración de Sentry para monitoreo de errores 