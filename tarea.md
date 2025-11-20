Necesito crear un sistema de calificación para competencias de danza con las siguientes especificaciones:

## Contexto del Proyecto
- React + TypeScript
- Tailwind CSS para estilos
- Zustand para manejo de estado
- Optimizado para tablets (principalmente) y laptops medianas
- Diseño profesional y moderno

## Funcionalidades Requeridas

### 1. Configuración Inicial
- **Configuración de Jurados**: Selector dinámico para elegir cantidad de jurados (mínimo 2, máximo 5)
- Poder definir nombres de los jurados (opcional)
- Guardar configuración en localStorage

### 2. Registro de Danzas
Formulario para registrar cada presentación con:
- **Nombre de la danza** (texto)
- **Grado y sección** (ejemplo: "1° A", "2° B", dropdown o input)
- **Grupo** (ejemplo: "Grupo 1", "Grupo 2", etc.)
- **Puntajes por jurado**: Input numérico para cada jurado (rango 0-100 o 0-10, definir escala)
- **Cálculo automático**: Suma total de puntajes al ingresar
- Botón para guardar/registrar la danza

### 3. Visualización en Tiempo Real

#### Sección Superior: Última Danza Registrada
- Card destacado mostrando:
  - Nombre de la danza
  - Grado y sección
  - Grupo
  - Puntajes individuales de cada jurado
  - **Total prominente** con animación de entrada
  - Badge o indicador visual llamativo

#### Sección Central: Formulario de Registro
- Formulario limpio y espacioso
- Labels claros
- Inputs grandes (optimizado para tablet)
- Validaciones en tiempo real
- Botón de registro destacado

#### Sección Inferior: Tabla de Rankings
- **Ranking General**: Todas las danzas ordenadas por puntaje total (mayor a menor)
- **Ranking por Grupos**: Tabs o secciones para ver ranking de cada grupo
- Columnas:
  - Posición (#)
  - Nombre de la danza
  - Grado/Sección
  - Grupo
  - Puntajes de cada jurado (columnas individuales)
  - Total (destacado)
- Uso de colores para posiciones: oro (1°), plata (2°), bronce (3°)
- Animaciones al actualizar el ranking

### 4. Gestión de Estado con Zustand
Store que maneje:
- Configuración de jurados (cantidad y nombres)
- Lista completa de danzas registradas
- Última danza agregada
- Rankings calculados (general y por grupos)
- Persistencia automática en localStorage

### 5. Persistencia de Datos
- **Auto-guardado**: Cada acción se guarda automáticamente en localStorage
- Cargar datos al iniciar la aplicación
- Mantener configuración de jurados entre sesiones

### 6. Exportación de Resultados
Botones para exportar en múltiples formatos:
- **Excel/CSV**: Tabla completa con todos los datos
- **PDF**: Reporte formateado con rankings
- **JSON**: Backup de datos completos

Opciones de exportación:
- Ranking general
- Ranking por grupo específico
- Reporte completo

### 7. Funcionalidades Adicionales

#### Gestión de Datos
- **Editar danza**: Modificar puntajes o datos de una danza ya registrada
- **Eliminar danza**: Borrar registro con confirmación
- **Limpiar todo**: Reset completo del sistema con doble confirmación
- **Búsqueda/Filtros**: Buscar por nombre, grupo, grado

#### Validaciones
- No permitir puntajes fuera de rango
- Campos requeridos marcados
- Mensajes de error claros
- Confirmaciones para acciones destructivas

#### Feedback Visual
- Toast notifications para acciones exitosas
- Loading states al procesar
- Animaciones suaves (fade, slide, scale)
- Highlight de la última danza agregada

### 8. Diseño Profesional para Tablet

#### Layout
- **Orientación horizontal** optimizada
- Grid responsive: formulario arriba, rankings abajo
- Espaciado generoso (mínimo 16px entre elementos)
- Touch targets grandes (mínimo 44x44px)

#### Tipografía
- Tamaños de fuente legibles desde distancia media
- Títulos: text-2xl o text-3xl
- Contenido: text-lg o text-xl
- Números/puntajes: text-xl o text-2xl (bold)

#### Colores
- Paleta profesional y vibrante
- Degradados sutiles para cards
- Contraste alto para legibilidad
- Colores distintivos por posición en ranking
- Modo oscuro/claro opcional

#### Componentes
- Cards con sombras y bordes redondeados
- Badges para categorías y grupos
- Iconos de Lucide React
- Tablas con alternancia de colores en filas
- Botones grandes con estados hover/active claros

### 9. Estructura de Datos
```typescript
interface Jurado {
  id: string;
  nombre?: string;
}

interface Danza {
  id: string;
  nombre: string;
  gradoSeccion: string;
  grupo: string;
  puntajes: number[]; // array con puntaje de cada jurado
  total: number;
  timestamp: number;
}

interface Config {
  cantidadJurados: number;
  jurados: Jurado[];
  escalaPuntaje: { min: number; max: number };
}
```

### 10. Estructura de Archivos Sugerida
```
src/
├── components/
│   ├── ConfigJurados.tsx
│   ├── UltimaDanza.tsx
│   ├── FormularioDanza.tsx
│   ├── RankingGeneral.tsx
│   ├── RankingGrupos.tsx
│   ├── TablaDanzas.tsx
│   └── ExportButtons.tsx
├── store/
│   └── danzasStore.ts
├── types/
│   └── index.ts
├── utils/
│   ├── calculations.ts
│   └── exportData.ts
├── hooks/
│   └── useDanzas.ts
└── App.tsx
```

### 11. Características Especiales

#### Auto-cálculo
- Sumar automáticamente puntajes al ingresar
- Actualizar rankings en tiempo real
- Recalcular posiciones automáticamente

#### Estadísticas
- Mostrar promedio por jurado
- Puntaje más alto/bajo del evento
- Cantidad total de participantes
- Distribución por grupos

#### Accesibilidad
- Navegación con teclado (Tab)
- Labels asociados a inputs
- Mensajes de error descriptivos
- Alto contraste

### 12. Consideraciones Técnicas
- TypeScript estricto con interfaces bien definidas
- Componentes modulares y reutilizables
- Optimización de rendimiento (useMemo para rankings)
- Validación de datos robusta
- Manejo de errores con try-catch
- Código limpio y comentado
- Responsive desde 768px (tablet) hasta 1280px (laptop mediana)

### 13. Animaciones y Transiciones
- Fade in para nueva danza registrada
- Scale up para puntaje total
- Slide para cambios en ranking
- Pulse para última danza destacada
- Smooth scroll a secciones

### 14. Estados de la Aplicación
- Estado vacío: Mensaje motivacional para comenzar
- Durante registro: Focus en formulario
- Post-registro: Highlight de última danza y actualización de ranking
- Modo visualización: Ranking en pantalla completa (opcional)

Por favor, genera el código completo y funcional con:
- Diseño profesional optimizado para tablet
- Toda la lógica de calificación y rankings
- Persistencia en localStorage
- Exportación de datos
- UI/UX pulida y moderna
- Validaciones completas
- Feedback visual excelente

El sistema debe ser intuitivo, rápido y confiable para uso en eventos en vivo.