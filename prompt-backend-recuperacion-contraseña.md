# 🔐 Implementación de Recuperación de Contraseña - SpringBoot Backend

## 📋 **Requisitos Funcionales**

Implementar un sistema completo de recuperación de contraseña que permita a los usuarios restablecer su contraseña mediante un enlace enviado por email.

### **Endpoints Requeridos:**

1. **POST `/api/auth/solicitar-recuperacion`**
   - Recibe: `{ "email": "usuario@correo.com" }`
   - Busca usuario por email
   - Genera token único de recuperación
   - Envía email con enlace de recuperación
   - Responde: `200 OK` o `404 Not Found`

2. **POST `/api/auth/cambiar-contraseña`**
   - Recibe: `{ "token": "abc123...", "nuevaContraseña": "NuevaPass123" }`
   - Valida token (existencia y expiración)
   - Cambia contraseña del usuario
   - Invalida token después del uso
   - Responde: `200 OK`, `400 Bad Request`, o `404 Not Found`

## 🏗️ **Estructura de Implementación**

### **1. Entidad Token de Recuperación**

```java
@Entity
@Table(name = "tokens_recuperacion")
public class TokenRecuperacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String token;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @Column(nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(nullable = false)
    private LocalDateTime fechaExpiracion;
    
    @Column(nullable = false)
    private Boolean utilizado = false;
    
    // Constructores, getters, setters
}
```

### **2. Repository**

```java
@Repository
public interface TokenRecuperacionRepository extends JpaRepository<TokenRecuperacion, Long> {
    Optional<TokenRecuperacion> findByTokenAndUtilizadoFalse(String token);
    void deleteByUsuarioId(Long usuarioId);
    void deleteByFechaExpiracionBefore(LocalDateTime fecha);
}
```

### **3. Service de Recuperación**

```java
@Service
@Transactional
public class RecuperacionContraseñaService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private TokenRecuperacionRepository tokenRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private static final int HORAS_EXPIRACION = 24;
    
    public void solicitarRecuperacion(String email) {
        // 1. Buscar usuario por email
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        
        // 2. Eliminar tokens anteriores del usuario
        tokenRepository.deleteByUsuarioId(usuario.getId());
        
        // 3. Generar nuevo token
        String token = UUID.randomUUID().toString().replace("-", "");
        
        // 4. Crear y guardar token de recuperación
        TokenRecuperacion tokenRecuperacion = new TokenRecuperacion();
        tokenRecuperacion.setToken(token);
        tokenRecuperacion.setUsuario(usuario);
        tokenRecuperacion.setFechaCreacion(LocalDateTime.now());
        tokenRecuperacion.setFechaExpiracion(LocalDateTime.now().plusHours(HORAS_EXPIRACION));
        tokenRecuperacion.setUtilizado(false);
        
        tokenRepository.save(tokenRecuperacion);
        
        // 5. Enviar email con enlace
        String enlaceRecuperacion = "https://tusistema.com/cambiar-contraseña?token=" + token;
        emailService.enviarEmailRecuperacion(usuario.getEmail(), enlaceRecuperacion);
    }
    
    public void cambiarContraseña(String token, String nuevaContraseña) {
        // 1. Buscar token válido
        TokenRecuperacion tokenRecuperacion = tokenRepository.findByTokenAndUtilizadoFalse(token)
            .orElseThrow(() -> new TokenInvalidoException("Token no válido"));
        
        // 2. Verificar expiración
        if (tokenRecuperacion.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            throw new TokenExpiradoException("Token expirado");
        }
        
        // 3. Obtener usuario
        Usuario usuario = tokenRecuperacion.getUsuario();
        
        // 4. Cambiar contraseña
        usuario.setContraseña(passwordEncoder.encode(nuevaContraseña));
        usuarioRepository.save(usuario);
        
        // 5. Marcar token como utilizado
        tokenRecuperacion.setUtilizado(true);
        tokenRepository.save(tokenRecuperacion);
    }
    
    @Scheduled(cron = "0 0 2 * * ?") // Ejecutar diariamente a las 2 AM
    public void limpiarTokensExpirados() {
        tokenRepository.deleteByFechaExpiracionBefore(LocalDateTime.now());
    }
}
```

### **4. Controller**

```java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Validated
public class AuthController {
    
    @Autowired
    private RecuperacionContraseñaService recuperacionService;
    
    @PostMapping("/solicitar-recuperacion")
    public ResponseEntity<?> solicitarRecuperacion(@RequestBody @Valid SolicitudRecuperacionDTO solicitud) {
        try {
            recuperacionService.solicitarRecuperacion(solicitud.getEmail());
            return ResponseEntity.ok(new MensajeResponse("Enlace de recuperación enviado"));
        } catch (UsuarioNoEncontradoException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error interno del servidor"));
        }
    }
    
    @PostMapping("/cambiar-contraseña")
    public ResponseEntity<?> cambiarContraseña(@RequestBody @Valid CambiarContraseñaDTO cambio) {
        try {
            recuperacionService.cambiarContraseña(cambio.getToken(), cambio.getNuevaContraseña());
            return ResponseEntity.ok(new MensajeResponse("Contraseña actualizada exitosamente"));
        } catch (TokenInvalidoException | TokenExpiradoException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error interno del servidor"));
        }
    }
}
```

### **5. DTOs**

```java
// SolicitudRecuperacionDTO.java
public class SolicitudRecuperacionDTO {
    @NotBlank(message = "El email es requerido")
    @Email(message = "Formato de email inválido")
    private String email;
    
    // Getters y setters
}

// CambiarContraseñaDTO.java
public class CambiarContraseñaDTO {
    @NotBlank(message = "El token es requerido")
    private String token;
    
    @NotBlank(message = "La nueva contraseña es requerida")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", 
             message = "La contraseña debe contener al menos una mayúscula, una minúscula y un número")
    private String nuevaContraseña;
    
    // Getters y setters
}
```

### **6. Service de Email**

```java
@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${app.mail.from}")
    private String fromEmail;
    
    public void enviarEmailRecuperacion(String destinatario, String enlaceRecuperacion) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            
            helper.setTo(destinatario);
            helper.setFrom(fromEmail);
            helper.setSubject("Recuperación de Contraseña - Sistema de Salud");
            
            String contenido = construirPlantillaEmail(enlaceRecuperacion);
            helper.setText(contenido, true);
            
            mailSender.send(mensaje);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar email", e);
        }
    }
    
    private String construirPlantillaEmail(String enlace) {
        return String.format("""
            <html>
                <body>
                    <h2>Recuperación de Contraseña</h2>
                    <p>Has solicitado restablecer tu contraseña.</p>
                    <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
                    <a href="%s" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Cambiar Contraseña
                    </a>
                    <p><strong>Este enlace expirará en 24 horas.</strong></p>
                    <p>Si no solicitaste este cambio, ignora este correo.</p>
                </body>
            </html>
            """, enlace);
    }
}
```

### **7. Excepciones Personalizadas**

```java
public class UsuarioNoEncontradoException extends RuntimeException {
    public UsuarioNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}

public class TokenInvalidoException extends RuntimeException {
    public TokenInvalidoException(String mensaje) {
        super(mensaje);
    }
}

public class TokenExpiradoException extends RuntimeException {
    public TokenExpiradoException(String mensaje) {
        super(mensaje);
    }
}
```

## ⚙️ **Configuración Requerida**

### **application.properties**

```properties
# Configuración de email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=tu-email@gmail.com
spring.mail.password=tu-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Email de la aplicación
app.mail.from=noreply@tusistema.com

# URL del frontend
app.frontend.url=https://tusistema.com
```

### **Dependencias en pom.xml**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

## 🔒 **Consideraciones de Seguridad**

1. **Tokens únicos**: Usar UUID para generar tokens aleatorios
2. **Expiración**: Tokens válidos por 24 horas máximo
3. **Un solo uso**: Invalidar token después del uso
4. **Limpieza**: Eliminar tokens expirados automáticamente
5. **Rate limiting**: Implementar límite de solicitudes por IP
6. **Logs de seguridad**: Registrar intentos de recuperación

## 📝 **Notas de Implementación**

- Asegurar que la tabla `usuarios` tenga un campo `email` único
- Configurar correctamente el servicio de email (Gmail, SendGrid, etc.)
- Implementar logs para auditoría de seguridad
- Considerar implementar CAPTCHA para evitar spam
- Testear el flujo completo en entorno de desarrollo

## ✅ **Resultado Esperado**

Al completar esta implementación, el sistema podrá:

1. ✅ Recibir solicitudes de recuperación por email
2. ✅ Generar tokens seguros de 24h de duración
3. ✅ Enviar emails con enlaces de recuperación
4. ✅ Validar tokens y cambiar contraseñas
5. ✅ Limpiar automáticamente tokens expirados
6. ✅ Manejar todos los casos de error apropiadamente

**Endpoints finales:**
- `POST /api/auth/solicitar-recuperacion` 
- `POST /api/auth/cambiar-contraseña`

¡Implementación lista para producción! 🚀 