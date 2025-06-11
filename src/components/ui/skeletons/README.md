# Sistema de Skeletons 🦴

Esta carpeta contiene componentes de skeleton reutilizables para mejorar la experiencia de usuario durante las cargas de datos.

## Componentes Disponibles

### 🏠 `DashboardSkeleton`
Skeleton completo para páginas de dashboard con estadísticas, cards y tablas.

```tsx
<DashboardSkeleton 
    showStats={true}     // Mostrar sección de estadísticas
    showCards={true}     // Mostrar sección de cards
    showTable={true}     // Mostrar sección de tabla
/>
```

### 📊 `StatisticsSkeleton`
Skeleton para cards de estadísticas en cuadrícula.

```tsx
<StatisticsSkeleton 
    cards={4}           // Número de cards (default: 4)
    showIcons={true}    // Mostrar iconos placeholder
/>
```

### 🃏 `CardSkeleton`
Skeleton básico para componentes tipo card.

```tsx
<CardSkeleton 
    showHeader={true}       // Mostrar header del card
    showAvatar={false}      // Mostrar avatar en el header
    showActions={false}     // Mostrar botones de acción
    contentLines={3}        // Líneas de contenido
/>
```

### 📋 `TableSkeleton`
Skeleton para tablas de datos.

```tsx
<TableSkeleton 
    rows={5}            // Número de filas
    columns={4}         // Número de columnas
    showHeader={true}   // Mostrar header de tabla
/>
```

### 📝 `FormSkeleton`
Skeleton para formularios con secciones y campos.

```tsx
<FormSkeleton 
    sections={3}            // Número de secciones
    fieldsPerSection={4}    // Campos por sección
    showHeader={true}       // Mostrar header del form
    showButton={true}       // Mostrar botón de envío
/>
```

### 📋 `ListSkeleton`
Skeleton para listas de elementos.

```tsx
<ListSkeleton 
    items={5}           // Número de elementos
    showAvatar={true}   // Mostrar avatares
    showActions={false} // Mostrar botones de acción
    showSubtext={true}  // Mostrar texto secundario
/>
```

### 👤 `ProfileSkeleton`
Skeleton completo para perfiles de usuario.

```tsx
<ProfileSkeleton 
    showBanner={true}   // Mostrar banner superior
    showTabs={true}     // Mostrar tabs de navegación
    showBio={true}      // Mostrar sección de biografía
/>
```

## Uso Recomendado

### 🎯 Importación
```tsx
import { DashboardSkeleton, FormSkeleton } from '@/src/components/ui/skeletons'
```

### 🔄 Patrón de Uso
```tsx
function MiComponente() {
    const [cargando, setCargando] = useState(true)
    
    if (cargando) {
        return <DashboardSkeleton showStats showTable />
    }
    
    return (
        // ... contenido real
    )
}
```

## Beneficios

- ✨ **Experiencia Premium**: Sensación de aplicación profesional
- ⚡ **Percepción de Velocidad**: Los usuarios perciben menor tiempo de carga
- 🎨 **Consistencia Visual**: Mantiene el layout durante la carga
- 📱 **Responsive**: Todos los skeletons se adaptan a diferentes pantallas
- 🎛️ **Configurables**: Props para personalizar cada skeleton

## Páginas que Usan Skeletons

- ✅ `/dashboard/medico` - DashboardSkeleton
- ✅ `/dashboard/entidad` - DashboardSkeleton  
- ✅ `/dashboard/paciente` - DashboardSkeleton
- ✅ `/dashboard/embajador` - StatisticsSkeleton, CardSkeleton, TableSkeleton
- ✅ `/dashboard/embajador/registrar-paciente` - FormSkeleton

## Próximas Mejoras

- 🔄 Skeletons animados con shimmer effect
- 🎨 Skeletons específicos por tipo de contenido
- 📊 Skeleton para gráficos y charts
- 🗓️ Skeleton para calendarios
- 💬 Skeleton para comentarios y chat

---

> 💡 **Tip**: Los skeletons deben coincidir lo más posible con el layout final para evitar cambios bruscos en la interfaz. 