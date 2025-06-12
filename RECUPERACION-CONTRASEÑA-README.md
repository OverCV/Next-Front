# 🔐 Sistema de Recuperación de Contraseña

## 📋 **Resumen de Funcionalidad**

Sistema completo de recuperación de contraseña que permite a los usuarios restablecer su contraseña mediante un enlace enviado por email.

## 🔄 **Flujo de Usuario**

### **1. Olvido de Contraseña**
```
Usuario en /acceso → Click "¿Olvidaste tu contraseña?" → /recuperar-contraseña
```

### **2. Solicitud de Recuperación**
```
/recuperar-contraseña → Ingresa email → Backend genera token → Email enviado
```

### **3. Cambio de Contraseña**
```
Email recibido → Click enlace → /cambiar-contraseña?token=xyz → Nueva contraseña → Éxito
```

### **4. Redirección Final**
```
Contraseña cambiada → /acceso → Login con nueva contraseña
```

## 🏗️ **Implementación Frontend**

### **Archivos Creados/Modificados:**

#### **1. Formularios**
- ✅ `src/components/forms/AccesoForm.tsx` - Agregado enlace "¿Olvidaste tu contraseña?"
- ✅ `src/components/forms/SolicitarRecuperacionForm.tsx` - Formulario para solicitar recuperación
- ✅ `src/components/forms/CambiarContraseñaForm.tsx` - Formulario para nueva contraseña

#### **2. Páginas**
- ✅ `app/recuperar-contraseña/page.tsx` - Página para solicitar recuperación
- ✅ `app/cambiar-contraseña/page.tsx` - Página para cambiar contraseña con token

#### **3. Servicios**
- ✅ `src/services/auth/auth.service.ts` - Agregados métodos:
  - `solicitarRecuperacionContraseña(email: string)`
  - `cambiarContraseñaConToken({ token, nuevaContraseña })`

#### **4. Endpoints**
- ✅ `src/services/auth/endpoints.ts` - Agregados:
  - `SOLICITAR_RECUPERACION: '/api/auth/solicitar-recuperacion'`
  - `CAMBIAR_CONTRASEÑA: '/api/auth/cambiar-contraseña'`

## 🔗 **Rutas del Sistema**

| Ruta                            | Propósito              | Componente                  |
| ------------------------------- | ---------------------- | --------------------------- |
| `/acceso`                       | Login principal        | `AccesoForm`                |
| `/recuperar-contraseña`         | Solicitar recuperación | `SolicitarRecuperacionForm` |
| `/cambiar-contraseña?token=xyz` | Cambiar contraseña     | `CambiarContraseñaForm`     |

## 📱 **Características del Frontend**

### **Validaciones**
- ✅ Email válido requerido
- ✅ Contraseña mínimo 8 caracteres
- ✅ Al menos una mayúscula, minúscula y número
- ✅ Confirmación de contraseña idéntica
- ✅ Token requerido y válido

### **Estados de UI**
- ✅ Loading states durante envío
- ✅ Mensajes de éxito/error
- ✅ Redirecciones automáticas
- ✅ Validación de token en URL

### **Responsive Design**
- ✅ Mobile-first design
- ✅ Misma estructura visual que login
- ✅ Iconos y indicadores claros

## 🔧 **API Endpoints Requeridos (Backend)**

### **POST `/api/auth/solicitar-recuperacion`**

**Request:**
```json
{
  "email": "usuario@correo.com"
}
```

**Response Success (200):**
```json
{
  "mensaje": "Enlace de recuperación enviado"
}
```

**Response Error (404):**
```json
{
  "error": "Usuario no encontrado"
}
```

### **POST `/api/auth/cambiar-contraseña`**

**Request:**
```json
{
  "token": "abc123def456...",
  "nuevaContraseña": "NuevaPass123"
}
```

**Response Success (200):**
```json
{
  "mensaje": "Contraseña actualizada exitosamente"
}
```

**Response Error (400):**
```json
{
  "error": "Token expirado o inválido"
}
```

## 📧 **Email de Recuperación**

### **Contenido del Email:**
```html
<h2>Recuperación de Contraseña</h2>
<p>Has solicitado restablecer tu contraseña.</p>
<p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
<a href="https://tusistema.com/cambiar-contraseña?token=abc123...">
  Cambiar Contraseña
</a>
<p><strong>Este enlace expirará en 24 horas.</strong></p>
<p>Si no solicitaste este cambio, ignora este correo.</p>
```

### **Enlace Generado:**
```
https://tusistema.com/cambiar-contraseña?token=550e8400-e29b-41d4-a716-446655440000
```

## 🔒 **Consideraciones de Seguridad**

### **Frontend:**
- ✅ Validación de token en URL
- ✅ Validaciones robustas de contraseña
- ✅ No almacenamiento de tokens sensibles
- ✅ Redirección automática después del éxito

### **Backend (Para Implementar):**
- 🔄 Tokens únicos con UUID
- 🔄 Expiración de 24 horas
- 🔄 Un solo uso por token
- 🔄 Limpieza automática de tokens expirados
- 🔄 Rate limiting por IP

## 🧪 **Testing Manual**

### **Flujo Completo:**

1. **Ir a login** → `http://localhost:3000/acceso`
2. **Click "¿Olvidaste tu contraseña?"** → Redirección a `/recuperar-contraseña`
3. **Ingresar email** → `usuario@test.com` → Click "Enviar"
4. **Verificar respuesta** → Debe mostrar mensaje de éxito
5. **Simular email** → Ir manualmente a `/cambiar-contraseña?token=test123`
6. **Nueva contraseña** → Ingresar contraseña válida 2 veces
7. **Confirmar** → Debe mostrar éxito y redireccionar a login

### **Casos de Error:**

1. **Email inexistente** → Debe mostrar error 404
2. **Token inválido** → `/cambiar-contraseña?token=invalid` → Mostrar error
3. **Sin token** → `/cambiar-contraseña` → Mostrar error
4. **Contraseña débil** → Debe mostrar validaciones

## 📋 **Prompt para Backend**

El archivo `prompt-backend-recuperacion-contraseña.md` contiene la implementación completa para SpringBoot incluyendo:

- ✅ Entidad `TokenRecuperacion`
- ✅ Repository con queries personalizadas
- ✅ Service con lógica de negocio
- ✅ Controller con endpoints
- ✅ DTOs de validación
- ✅ Service de email con plantilla HTML
- ✅ Excepciones personalizadas
- ✅ Configuración de email (Gmail/SMTP)
- ✅ Limpieza automática de tokens
- ✅ Consideraciones de seguridad

## 🚀 **Estado Actual**

### **✅ Completado (Frontend):**
- Modificación de AccesoForm con enlace
- Formulario de solicitud de recuperación
- Formulario de cambio de contraseña
- Páginas con validación de token
- Servicios de API integrados
- Manejo completo de errores
- UI/UX consistente con el sistema

### **🔄 Pendiente (Backend):**
- Implementar endpoints según prompt
- Configurar servicio de email
- Crear tabla `tokens_recuperacion`
- Testear flujo completo

## 🎯 **Próximos Pasos**

1. **Implementar backend** usando el prompt proporcionado
2. **Configurar email** (Gmail, SendGrid, etc.)
3. **Testear flujo completo** end-to-end
4. **Ajustar URLs** del frontend según dominio de producción
5. **Configurar rate limiting** para prevenir abuso

¡Sistema de recuperación de contraseña listo para usar! 🎉 