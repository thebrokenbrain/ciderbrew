# 🏗️ Arquitectura de Ciderbrew

*Una explicación completa de cómo está construida la aplicación*

## 🎯 Visión General

Ciderbrew está construido con una arquitectura moderna de React que prioriza:
- **Modularidad**: Cada pieza tiene una responsabilidad específica
- **Reutilización**: Componentes que se pueden usar en múltiples lugares
- **Mantenibilidad**: Código fácil de entender y modificar
- **Escalabilidad**: Estructura que puede crecer sin volverse caótica

## 🧩 Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────┐
│              FRONTEND (React)           │
├─────────────────────────────────────────┤
│  🎨 Presentation Layer                  │
│  └─ Components + Hooks + Styles        │
├─────────────────────────────────────────┤
│  ⚙️ Business Logic Layer               │
│  └─ Services + Utils + Types           │
├─────────────────────────────────────────┤
│  💾 Data Layer                         │
│  └─ Local Storage + API Calls          │
└─────────────────────────────────────────┘
           ↕️ (API HTTP Calls)
┌─────────────────────────────────────────┐
│          EXTERNAL SERVICES              │
│  🍺 Homebrew Formulae API              │
│  📦 CDN para iconos y assets           │
└─────────────────────────────────────────┘
```

## 📁 Estructura del Proyecto

### Organización de Directorios

```
src/
├── 🎨 components/              # Componentes de UI reutilizables
│   ├── AppCard.tsx            # Tarjeta individual de aplicación
│   ├── Header.tsx             # Cabecera principal
│   ├── SearchInterface.tsx    # Barra de búsqueda inteligente
│   ├── TabNavigation.tsx      # Navegación por categorías
│   ├── ProfileManager.tsx     # Gestión de perfiles
│   ├── ScriptSection.tsx      # Generador y preview de scripts
│   └── ToastContainer.tsx     # Sistema de notificaciones
│
├── 🪝 hooks/                  # React Hooks personalizados
│   ├── useAppSelection.ts     # Estado global de selección
│   ├── useTheme.ts           # Gestión de temas claro/oscuro
│   ├── useLocalStorage.ts    # Persistencia local
│   └── useDebounce.ts        # Optimización de búsquedas
│
├── ⚙️ services/              # Lógica de negocio y APIs
│   ├── ScriptGenerator.ts    # Generación de scripts bash
│   ├── HybridSearchService.ts # Búsqueda local + API
│   ├── StorageService.ts     # Persistencia de datos
│   └── ArchitectureDetectionService.ts # Detección M1/Intel
│
├── 📊 data/                  # Datos estáticos y configuración
│   ├── apps.ts              # Catálogo de aplicaciones
│   ├── categories.ts        # Definición de categorías
│   └── constants.ts         # Constantes globales
│
├── 🔧 types/                 # Definiciones TypeScript
│   ├── app.types.ts         # Tipos de aplicaciones
│   ├── ui.types.ts          # Tipos de interfaz
│   └── api.types.ts         # Tipos de APIs
│
├── 🛠️ utils/                # Utilidades y helpers
│   ├── formatters.ts        # Formateo de texto/datos
│   ├── validators.ts        # Validaciones
│   └── constants.ts         # Constantes compartidas
│
└── 🧪 __tests__/            # Suite de pruebas
    ├── components/          # Tests de componentes
    ├── services/           # Tests de servicios
    ├── hooks/              # Tests de hooks
    └── integration/        # Tests de integración
```

## 🎨 Capa de Presentación (UI)

### Componentes Principales

#### 🏠 App.tsx - Componente Raíz
```typescript
// El componente principal que orquesta toda la aplicación
function App() {
  return (
    <div className="app">
      <Header />                    // Cabecera con navegación
      <SearchInterface />           // Búsqueda inteligente
      <TabNavigation />            // Categorías y filtros
      <AppGrid />                  // Grid de aplicaciones
      <ScriptSection />            // Generador de scripts
      <ProfileManager />           // Gestión de perfiles
      <ToastContainer />           // Notificaciones
    </div>
  )
}
```

**Responsabilidades:**
- Estructura general de la aplicación
- Orquestación de componentes principales
- Gestión del estado global

#### 🔍 SearchInterface.tsx - Búsqueda Inteligente
```typescript
// Búsqueda híbrida que combina resultados locales y API
function SearchInterface() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  
  // Hook personalizado para debounce
  const debouncedQuery = useDebounce(query, 300)
  
  // Búsqueda híbrida
  useEffect(() => {
    if (debouncedQuery) {
      HybridSearchService.search(debouncedQuery)
        .then(setResults)
    }
  }, [debouncedQuery])
}
```

**Características:**
- Búsqueda en tiempo real con debounce
- Resultados de catálogo local + API Homebrew
- Autocompletado inteligente
- Historial de búsquedas

#### 🃏 AppCard.tsx - Tarjeta de Aplicación
```typescript
interface AppCardProps {
  app: App                    // Datos de la aplicación
  isSelected: boolean         // Estado de selección
  onToggle: (app: App) => void // Callback al seleccionar
}

function AppCard({ app, isSelected, onToggle }: AppCardProps) {
  return (
    <div 
      className={`card ${isSelected ? 'selected' : ''}`}
      onClick={() => onToggle(app)}
    >
      <img src={app.icon} alt={app.name} />
      <h3>{app.name}</h3>
      <p>{app.description}</p>
      <div className="tags">
        {app.categories.map(cat => <span key={cat}>{cat}</span>)}
      </div>
    </div>
  )
}
```

**Funcionalidades:**
- Diseño responsivo
- Estados visuales (seleccionado/no seleccionado)
- Información rica (icono, nombre, descripción, categorías)
- Interacciones touch-friendly

## 🪝 Hooks Personalizados

### useAppSelection - Estado Global de Selección

```typescript
interface AppSelectionState {
  selectedApps: App[]           // Apps seleccionadas
  toggleApp: (app: App) => void // Agregar/quitar app
  clearSelection: () => void    // Limpiar selección
  selectMultiple: (apps: App[]) => void // Seleccionar varias
}

function useAppSelection(): AppSelectionState {
  const [selectedApps, setSelectedApps] = useState<App[]>([])
  
  const toggleApp = useCallback((app: App) => {
    setSelectedApps(current => 
      current.find(a => a.id === app.id)
        ? current.filter(a => a.id !== app.id)  // Quitar
        : [...current, app]                     // Agregar
    )
  }, [])
  
  // Persistir en localStorage
  useEffect(() => {
    StorageService.saveSelection(selectedApps)
  }, [selectedApps])
  
  return { selectedApps, toggleApp, clearSelection, selectMultiple }
}
```

**Por qué un Hook personalizado:**
- Lógica de selección reutilizable en múltiples componentes
- Estado persistente entre sesiones
- Optimizaciones de performance con useCallback
- API limpia y consistente

### useTheme - Gestión de Temas

```typescript
type Theme = 'light' | 'dark' | 'auto'

function useTheme() {
  const [theme, setTheme] = useState<Theme>('auto')
  
  // Detectar preferencia del sistema
  const systemTheme = useMediaQuery('(prefers-color-scheme: dark)')
    ? 'dark' : 'light'
  
  // Tema efectivo
  const effectiveTheme = theme === 'auto' ? systemTheme : theme
  
  // Aplicar tema al DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme)
  }, [effectiveTheme])
  
  return { theme, setTheme, effectiveTheme }
}
```

## ⚙️ Capa de Lógica de Negocio

### ScriptGenerator - Generación de Scripts

```typescript
class ScriptGenerator {
  static generateInstallScript(
    apps: App[], 
    options: ScriptOptions
  ): string {
    const commands = [
      this.generateHeader(),
      this.generateBrewCheck(),
      this.generateArchDetection(),
      ...apps.map(app => this.generateInstallCommand(app)),
      this.generateCleanup(options.cleanup),
      this.generateFooter()
    ]
    
    return commands.join('\n')
  }
  
  private static generateBrewCheck(): string {
    return `
# Verificar si Homebrew está instalado
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew no está instalado"
    echo "📦 Instalando Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
    `
  }
  
  private static generateArchDetection(): string {
    return `
# Detectar arquitectura del sistema
ARCH=$(uname -m)
if [[ "$ARCH" == "arm64" ]]; then
    echo "🍎 Detectado Apple Silicon (M1/M2/M3)"
else
    echo "💻 Detectado Intel x86_64"
fi
    `
  }
}
```

**Características del Generador:**
- Scripts bash optimizados y seguros
- Detección automática de arquitectura
- Manejo de errores robusto
- Logging detallado opcional
- Cleanup automático de archivos temporales

### HybridSearchService - Búsqueda Inteligente

```typescript
class HybridSearchService {
  private static cache = new Map<string, SearchResult[]>()
  
  static async search(query: string): Promise<SearchResult[]> {
    // 1. Búsqueda en cache
    if (this.cache.has(query)) {
      return this.cache.get(query)!
    }
    
    // 2. Búsqueda local en apps.ts
    const localResults = this.searchLocal(query)
    
    // 3. Búsqueda en API de Homebrew (si query > 2 chars)
    const apiResults = query.length > 2 
      ? await this.searchHomebrew(query)
      : []
    
    // 4. Combinar y rankear resultados
    const combinedResults = this.combineAndRank(
      localResults, 
      apiResults, 
      query
    )
    
    // 5. Guardar en cache
    this.cache.set(query, combinedResults)
    
    return combinedResults
  }
  
  private static searchLocal(query: string): App[] {
    return apps.filter(app => 
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      app.description.toLowerCase().includes(query.toLowerCase()) ||
      app.categories.some(cat => 
        cat.toLowerCase().includes(query.toLowerCase())
      )
    )
  }
  
  private static async searchHomebrew(query: string): Promise<BrewApp[]> {
    try {
      const response = await fetch(
        `https://formulae.brew.sh/api/formula.json?q=${query}`
      )
      const data = await response.json()
      return data.map(this.transformBrewAppToApp)
    } catch (error) {
      console.warn('API Homebrew no disponible:', error)
      return []
    }
  }
}
```

**Estrategia de Búsqueda:**
1. **Cache primero**: Resultados instantáneos para búsquedas repetidas
2. **Local primero**: Apps del catálogo curado aparecen primero
3. **API como respaldo**: Acceso a todo el ecosistema Homebrew
4. **Ranking inteligente**: Los resultados más relevantes primero

## 💾 Capa de Datos

### StorageService - Persistencia Local

```typescript
class StorageService {
  private static readonly KEYS = {
    SELECTED_APPS: 'ciderbrew_selected_apps',
    PROFILES: 'ciderbrew_profiles',
    THEME: 'ciderbrew_theme',
    SEARCH_HISTORY: 'ciderbrew_search_history'
  }
  
  // Gestión de aplicaciones seleccionadas
  static saveSelection(apps: App[]): void {
    localStorage.setItem(
      this.KEYS.SELECTED_APPS, 
      JSON.stringify(apps)
    )
  }
  
  static loadSelection(): App[] {
    try {
      const stored = localStorage.getItem(this.KEYS.SELECTED_APPS)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }
  
  // Gestión de perfiles
  static saveProfile(name: string, apps: App[]): void {
    const profiles = this.loadProfiles()
    profiles[name] = {
      apps,
      createdAt: new Date().toISOString(),
      id: generateId()
    }
    localStorage.setItem(this.KEYS.PROFILES, JSON.stringify(profiles))
  }
  
  // Exportar/Importar configuraciones
  static exportProfile(name: string): string {
    const profile = this.loadProfiles()[name]
    return JSON.stringify(profile, null, 2)
  }
  
  static importProfile(jsonString: string): Profile {
    const profile = JSON.parse(jsonString)
    // Validar estructura del perfil
    this.validateProfile(profile)
    return profile
  }
}
```

## 🔄 Flujo de Datos

### 1. Selección de Aplicaciones
```
Usuario hace clic en AppCard
       ↓
AppCard llama onToggle(app)
       ↓
useAppSelection.toggleApp(app)
       ↓
Estado se actualiza
       ↓
Componentes se re-renderizan
       ↓
StorageService guarda en localStorage
```

### 2. Búsqueda
```
Usuario escribe en SearchInterface
       ↓
useDebounce delay de 300ms
       ↓
HybridSearchService.search(query)
       ↓
Búsqueda local + API Homebrew
       ↓
Resultados se combinan y rankean
       ↓
Estado de resultados se actualiza
       ↓
UI muestra resultados
```

### 3. Generación de Script
```
Usuario hace clic "Generar Script"
       ↓
ScriptSection obtiene selectedApps
       ↓
ScriptGenerator.generateInstallScript()
       ↓
Script bash se genera
       ↓
Archivo se descarga automáticamente
```

## 🎯 Patrones de Diseño Utilizados

### 1. **Separation of Concerns**
- Componentes solo manejan UI
- Servicios manejan lógica de negocio
- Hooks manejan estado y efectos

### 2. **Single Responsibility Principle**
- Cada componente tiene una función específica
- Cada servicio maneja un dominio específico
- Cada hook gestiona un aspecto del estado

### 3. **Dependency Injection**
- Los componentes reciben sus dependencias como props
- Los servicios son clases estáticas sin estado
- Los hooks encapsulan efectos complejos

### 4. **Observer Pattern**
- React's state system para actualizaciones reactivas
- LocalStorage events para sincronización entre tabs
- Custom events para comunicación entre componentes

## 🚀 Optimizaciones de Performance

### 1. **Code Splitting**
```typescript
// Lazy loading de componentes grandes
const ProfileManager = lazy(() => import('./ProfileManager'))
const ScriptPreview = lazy(() => import('./ScriptPreview'))

// Envolver en Suspense
<Suspense fallback={<Loading />}>
  <ProfileManager />
</Suspense>
```

### 2. **Memoización**
```typescript
// Memoizar componentes costosos
const AppCard = memo(({ app, isSelected, onToggle }) => {
  // Componente solo se re-renderiza si props cambian
})

// Memoizar cálculos costosos
const filteredApps = useMemo(() => 
  apps.filter(app => app.category === selectedCategory),
  [apps, selectedCategory]
)
```

### 3. **Debouncing**
```typescript
// Evitar búsquedas excesivas
const debouncedQuery = useDebounce(searchQuery, 300)
```

### 4. **Virtual Scrolling**
```typescript
// Para listas grandes de aplicaciones
import { FixedSizeList as List } from 'react-window'

const AppList = ({ apps }) => (
  <List
    height={600}
    itemCount={apps.length}
    itemSize={120}
    itemData={apps}
  >
    {AppCardRenderer}
  </List>
)
```

## 🔒 Consideraciones de Seguridad

### 1. **Sanitización de Datos**
```typescript
// Limpiar input del usuario antes de usar en scripts
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[;&|`$]/g, '') // Remover caracteres peligrosos
    .trim()
}
```

### 2. **Validación de APIs**
```typescript
// Validar respuestas de APIs externas
const validateBrewResponse = (data: unknown): BrewApp[] => {
  if (!Array.isArray(data)) throw new Error('Invalid API response')
  
  return data.map(item => {
    if (!item.name || !item.desc) {
      throw new Error('Missing required fields')
    }
    return transformToApp(item)
  })
}
```

### 3. **Content Security Policy**
```html
<!-- Solo permitir recursos de fuentes confiables -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               img-src 'self' https://cdn.jsdelivr.net;
               api-src 'self' https://formulae.brew.sh;">
```

## 📊 Métricas y Monitoreo

### 1. **Performance Metrics**
```typescript
// Medir tiempo de renderizado
const measureRenderTime = (componentName: string) => {
  const start = performance.now()
  
  useEffect(() => {
    const end = performance.now()
    console.log(`${componentName} rendered in ${end - start}ms`)
  })
}
```

### 2. **User Analytics**
```typescript
// Tracking de uso (sin datos personales)
const trackEvent = (event: string, data?: object) => {
  // Solo en producción y con consentimiento
  if (process.env.NODE_ENV === 'production' && hasConsent) {
    analytics.track(event, data)
  }
}
```

## 🔄 Ciclo de Vida del Componente

```typescript
function ComponentLifecycle() {
  // 1. Montaje inicial
  useEffect(() => {
    console.log('Component mounted')
    // Setup inicial, suscripciones
    
    return () => {
      console.log('Component unmounted')
      // Cleanup, cancelar suscripciones
    }
  }, [])
  
  // 2. Actualizaciones específicas
  useEffect(() => {
    console.log('selectedApps changed')
    // Reaccionar a cambios específicos
  }, [selectedApps])
  
  // 3. Cada render
  useLayoutEffect(() => {
    // Cambios al DOM antes del paint
  })
}
```

---

## 🎓 Próximos Pasos

Para profundizar en la arquitectura:

1. **[Componentes Detallados](../technical/components.md)** - Análisis de cada componente
2. **[Servicios y APIs](../api/README.md)** - Documentación técnica de servicios
3. **[Testing Strategy](../testing/README.md)** - Cómo probamos la arquitectura
4. **[Performance Guide](../technical/performance.md)** - Optimizaciones avanzadas

Esta arquitectura está diseñada para ser **modular, mantenible y escalable**. Cada decisión de diseño está pensada para facilitar el desarrollo, testing y evolución futura del proyecto. 🚀
