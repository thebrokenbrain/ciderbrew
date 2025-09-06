# 🔧 API Reference - Servicios y Métodos

*Documentación técnica completa de todas las funciones, clases y servicios*

## 📋 Índice de APIs

- **[ScriptGenerator](#scriptgenerator)** - Generación de scripts bash
- **[HybridSearchService](#hybridsearchservice)** - Búsqueda inteligente
- **[StorageService](#storageservice)** - Persistencia local
- **[ArchitectureDetectionService](#architecturedetectionservice)** - Detección de sistema
- **[ValidationService](#validationservice)** - Validaciones
- **[FormatService](#formatservice)** - Formateado de datos
- **[Hooks Personalizados](#hooks-personalizados)** - React Hooks
- **[Tipos TypeScript](#tipos-typescript)** - Interfaces y tipos

---

## ScriptGenerator

Servicio estático para generar scripts bash optimizados de instalación.

### Métodos Principales

#### `generateInstallScript(apps, options)`

Genera un script bash completo para instalar aplicaciones seleccionadas.

```typescript
static generateInstallScript(
  apps: App[], 
  options: ScriptOptions = {}
): string
```

**Parámetros:**
- `apps` (App[]): Array de aplicaciones a instalar
- `options` (ScriptOptions): Configuraciones del script

**Retorna:** String con el script bash completo

**Ejemplo:**
```typescript
const apps = [
  { id: '1', name: 'Chrome', brewId: 'google-chrome', category: 'browsers' },
  { id: '2', name: 'VSCode', brewId: 'visual-studio-code', category: 'development' }
]

const options = {
  includeUpdates: true,
  cleanup: true,
  verbose: false,
  architecture: 'auto'
}

const script = ScriptGenerator.generateInstallScript(apps, options)

console.log(script)
// Output:
// #!/bin/bash
// # Ciderbrew Installation Script
// # Generated on: 2025-01-XX
// 
// echo "🍺 Installing 2 applications..."
// brew install --cask google-chrome
// brew install --cask visual-studio-code
// echo "✅ Installation completed!"
```

#### `generateHeader()`

Genera el encabezado del script con metadata.

```typescript
private static generateHeader(): string
```

**Retorna:** Header del script con información de generación

**Output ejemplo:**
```bash
#!/bin/bash
# ===========================================
# Ciderbrew Installation Script
# Generated on: 2025-01-15 14:30:25
# Applications: 5 selected
# ===========================================

set -e  # Exit on any error
```

#### `generateBrewCheck()`

Genera código para verificar si Homebrew está instalado.

```typescript
private static generateBrewCheck(): string
```

**Retorna:** Código bash para verificar/instalar Homebrew

**Output ejemplo:**
```bash
# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "🚫 Homebrew not found. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
        export PATH="/opt/homebrew/bin:$PATH"
    fi
fi
```

#### `generateArchDetection()`

Genera código para detectar la arquitectura del sistema.

```typescript
private static generateArchDetection(): string
```

**Retorna:** Código bash para detectar Apple Silicon vs Intel

**Output ejemplo:**
```bash
# Detect system architecture
ARCH=$(uname -m)
if [[ "$ARCH" == "arm64" ]]; then
    echo "🍎 Detected Apple Silicon (M1/M2/M3)"
    HOMEBREW_PREFIX="/opt/homebrew"
else
    echo "💻 Detected Intel x86_64"
    HOMEBREW_PREFIX="/usr/local"
fi

echo "Using Homebrew prefix: $HOMEBREW_PREFIX"
```

#### `generateInstallCommand(app, options)`

Genera comando de instalación individual para una aplicación.

```typescript
private static generateInstallCommand(
  app: App, 
  options: ScriptOptions
): string
```

**Parámetros:**
- `app` (App): Aplicación a instalar
- `options` (ScriptOptions): Opciones de instalación

**Retorna:** Comando bash para instalar la aplicación

**Ejemplo:**
```typescript
const app = { 
  name: 'Chrome', 
  brewId: 'google-chrome', 
  type: 'cask' 
}

const command = ScriptGenerator.generateInstallCommand(app, { verbose: true })

// Output: "brew install --cask google-chrome --verbose"
```

### Interfaces

#### `ScriptOptions`

```typescript
interface ScriptOptions {
  includeUpdates?: boolean      // Incluir comando de actualización
  cleanup?: boolean             // Limpiar cache después
  verbose?: boolean             // Output detallado
  architecture?: 'auto' | 'x86_64' | 'arm64'  // Arquitectura target
  dryRun?: boolean             // Solo mostrar comandos sin ejecutar
  logFile?: string             // Archivo de log personalizado
}
```

#### `GeneratedScript`

```typescript
interface GeneratedScript {
  content: string              // Contenido del script
  filename: string             // Nombre sugerido del archivo
  checksum: string            // Hash MD5 del contenido
  metadata: ScriptMetadata    // Metadata del script
}
```

---

## HybridSearchService

Servicio para búsqueda inteligente que combina resultados locales con la API de Homebrew.

### Métodos Principales

#### `search(query, options)`

Realiza búsqueda híbrida en catálogo local y API de Homebrew.

```typescript
static async search(
  query: string, 
  options: SearchOptions = {}
): Promise<SearchResult[]>
```

**Parámetros:**
- `query` (string): Término de búsqueda
- `options` (SearchOptions): Opciones de búsqueda

**Retorna:** Promise con array de resultados rankeados

**Ejemplo:**
```typescript
const results = await HybridSearchService.search('code editor', {
  maxResults: 10,
  includeApi: true,
  categories: ['development']
})

results.forEach(result => {
  console.log(`${result.app.name} (${result.type}) - Score: ${result.relevance}`)
})

// Output:
// Visual Studio Code (local) - Score: 0.95
// Sublime Text (local) - Score: 0.87
// Atom (api) - Score: 0.72
```

#### `searchLocal(query)`

Busca solo en el catálogo local de aplicaciones.

```typescript
static searchLocal(query: string): App[]
```

**Parámetros:**
- `query` (string): Término de búsqueda

**Retorna:** Array de aplicaciones que coinciden

**Algoritmo de búsqueda:**
```typescript
// Prioridad de coincidencias:
// 1. Nombre exacto (score: 1.0)
// 2. Nombre comienza con query (score: 0.9)
// 3. Nombre contiene query (score: 0.7)
// 4. Descripción contiene query (score: 0.5)
// 5. Categorías contienen query (score: 0.3)
```

#### `searchHomebrew(query)`

Busca en la API oficial de Homebrew.

```typescript
static async searchHomebrew(
  query: string
): Promise<BrewApp[]>
```

**Parámetros:**
- `query` (string): Término de búsqueda

**Retorna:** Promise con aplicaciones de Homebrew

**Rate Limiting:** 100 requests/hour por IP

**Ejemplo:**
```typescript
try {
  const brewApps = await HybridSearchService.searchHomebrew('firefox')
  
  brewApps.forEach(app => {
    console.log(`${app.name}: ${app.desc}`)
  })
} catch (error) {
  console.error('API de Homebrew no disponible:', error)
}
```

#### `combineAndRank(localResults, apiResults, query)`

Combina resultados locales y de API, aplicando ranking inteligente.

```typescript
private static combineAndRank(
  localResults: App[],
  apiResults: BrewApp[],
  query: string
): SearchResult[]
```

**Algoritmo de ranking:**
1. **Relevancia por tipo:**
   - Resultados locales: +0.2 bonus (curados manualmente)
   - Resultados API: score base

2. **Relevancia por coincidencia:**
   - Nombre exacto: score 1.0
   - Nombre empieza con query: score 0.9
   - Nombre contiene query: score 0.7
   - Descripción contiene query: score 0.5

3. **Popularidad:** Apps con más descargas +0.1 bonus

### Interfaces

#### `SearchOptions`

```typescript
interface SearchOptions {
  maxResults?: number          // Máximo número de resultados (default: 20)
  includeApi?: boolean         // Incluir resultados de API (default: true)
  categories?: Category[]      // Filtrar por categorías
  minScore?: number           // Score mínimo de relevancia (default: 0.3)
  sortBy?: 'relevance' | 'name' | 'popularity'  // Ordenamiento
}
```

#### `SearchResult`

```typescript
interface SearchResult {
  type: 'local' | 'api'       // Fuente del resultado
  app: App                    // Datos de la aplicación
  relevance: number           // Score de relevancia (0-1)
  matchType: 'name' | 'description' | 'category'  // Tipo de coincidencia
}
```

---

## StorageService

Servicio para gestión de persistencia local usando LocalStorage.

### Métodos Principales

#### `saveSelection(apps)`

Guarda la selección actual de aplicaciones.

```typescript
static saveSelection(apps: App[]): void
```

**Parámetros:**
- `apps` (App[]): Array de aplicaciones seleccionadas

**Storage Key:** `ciderbrew_selected_apps`

**Ejemplo:**
```typescript
const selectedApps = [
  { id: '1', name: 'Chrome', brewId: 'google-chrome' }
]

StorageService.saveSelection(selectedApps)

// Verifica en DevTools:
// localStorage.getItem('ciderbrew_selected_apps')
```

#### `loadSelection()`

Carga la selección guardada de aplicaciones.

```typescript
static loadSelection(): App[]
```

**Retorna:** Array de aplicaciones previamente seleccionadas

**Error Handling:** Retorna array vacío si hay error de parsing

**Ejemplo:**
```typescript
const savedApps = StorageService.loadSelection()

if (savedApps.length > 0) {
  console.log(`Recuperadas ${savedApps.length} aplicaciones`)
  setSelectedApps(savedApps)
}
```

#### `saveProfile(name, apps)`

Guarda un perfil nombrado con selección de aplicaciones.

```typescript
static saveProfile(name: string, apps: App[]): void
```

**Parámetros:**
- `name` (string): Nombre del perfil
- `apps` (App[]): Aplicaciones del perfil

**Storage Key:** `ciderbrew_profiles`

**Ejemplo:**
```typescript
const developmentApps = [
  { id: '1', name: 'VSCode', brewId: 'visual-studio-code' },
  { id: '2', name: 'Git', brewId: 'git' },
  { id: '3', name: 'Node.js', brewId: 'node' }
]

StorageService.saveProfile('Development Setup', developmentApps)
```

#### `loadProfiles()`

Carga todos los perfiles guardados.

```typescript
static loadProfiles(): Record<string, Profile>
```

**Retorna:** Object con perfiles indexados por nombre

**Ejemplo:**
```typescript
const profiles = StorageService.loadProfiles()

Object.keys(profiles).forEach(name => {
  const profile = profiles[name]
  console.log(`${name}: ${profile.apps.length} apps, created ${profile.createdAt}`)
})
```

#### `exportProfile(name)`

Exporta un perfil como JSON string.

```typescript
static exportProfile(name: string): string
```

**Parámetros:**
- `name` (string): Nombre del perfil a exportar

**Retorna:** JSON string del perfil

**Ejemplo:**
```typescript
const jsonProfile = StorageService.exportProfile('Development Setup')

// Crear blob para descarga
const blob = new Blob([jsonProfile], { type: 'application/json' })
const url = URL.createObjectURL(blob)

// Trigger download
const a = document.createElement('a')
a.href = url
a.download = 'development-setup.json'
a.click()
```

#### `importProfile(jsonString)`

Importa un perfil desde JSON string.

```typescript
static importProfile(jsonString: string): Profile
```

**Parámetros:**
- `jsonString` (string): JSON del perfil a importar

**Retorna:** Object Profile validado

**Throws:** Error si JSON es inválido o estructura incorrecta

**Ejemplo:**
```typescript
const fileInput = document.querySelector('input[type="file"]')
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0]
  const jsonString = await file.text()
  
  try {
    const profile = StorageService.importProfile(jsonString)
    console.log(`Importado: ${profile.apps.length} apps`)
    setSelectedApps(profile.apps)
  } catch (error) {
    alert('Error importing profile: ' + error.message)
  }
})
```

### Interfaces

#### `Profile`

```typescript
interface Profile {
  id: string                  // UUID único del perfil
  apps: App[]                // Aplicaciones del perfil
  createdAt: string          // ISO timestamp de creación
  updatedAt?: string         // ISO timestamp de última actualización
  description?: string       // Descripción opcional
  tags?: string[]           // Tags para categorización
  version: string           // Versión del formato (para migración)
}
```

---

## ArchitectureDetectionService

Servicio para detectar la arquitectura del sistema y optimizar comandos.

### Métodos Principales

#### `detectArchitecture()`

Detecta la arquitectura del sistema del usuario.

```typescript
static detectArchitecture(): Architecture
```

**Retorna:** 'arm64' | 'x86_64' | 'unknown'

**Método de detección:**
```typescript
// Usa User Agent y características del navegador
const userAgent = navigator.userAgent
const platform = navigator.platform

// Para macOS detecta:
// - Apple Silicon: arm64 
// - Intel Macs: x86_64
```

#### `getHomebrewPrefix(architecture)`

Retorna el prefix correcto de Homebrew según arquitectura.

```typescript
static getHomebrewPrefix(architecture: Architecture): string
```

**Parámetros:**
- `architecture` (Architecture): Arquitectura detectada

**Retorna:** Path del prefix de Homebrew

**Mappings:**
```typescript
const prefixes = {
  'arm64': '/opt/homebrew',      // Apple Silicon
  'x86_64': '/usr/local',        // Intel
  'unknown': '/usr/local'        // Default fallback
}
```

#### `optimizeForArchitecture(command, architecture)`

Optimiza comandos para arquitectura específica.

```typescript
static optimizeForArchitecture(
  command: string, 
  architecture: Architecture
): string
```

**Optimizaciones aplicadas:**
- Usa prefix correcto de Homebrew
- Agrega flags específicos de arquitectura
- Incluye variables de entorno necesarias

---

## ValidationService

Servicio para validar datos y configuraciones.

### Métodos Principales

#### `validateApp(app)`

Valida estructura de objeto App.

```typescript
static validateApp(app: unknown): app is App
```

**Validaciones:**
- Presencia de campos requeridos
- Tipos de datos correctos
- Formato de IDs válido
- URLs válidas (si existen)

#### `validateProfile(profile)`

Valida estructura de perfil importado.

```typescript
static validateProfile(profile: unknown): profile is Profile
```

#### `sanitizeInput(input)`

Sanitiza input del usuario para evitar inyección de comandos.

```typescript
static sanitizeInput(input: string): string
```

**Limpieza aplicada:**
- Remueve caracteres peligrosos: `; & | ` $ < >`
- Escapa comillas
- Limita longitud

---

## FormatService

Servicio para formateo y transformación de datos.

### Métodos Principales

#### `formatAppName(name)`

Formatea nombres de aplicaciones para display.

```typescript
static formatAppName(name: string): string
```

**Transformaciones:**
- Convierte kebab-case a Title Case
- Maneja acrónimos comunes (API, URL, etc.)
- Corrige nombres comerciales

**Ejemplo:**
```typescript
formatAppName('visual-studio-code') // → 'Visual Studio Code'
formatAppName('docker-desktop')     // → 'Docker Desktop'
formatAppName('nodejs')             // → 'Node.js'
```

#### `formatFileSize(bytes)`

Formatea tamaños de archivo a formato legible.

```typescript
static formatFileSize(bytes: number): string
```

**Ejemplo:**
```typescript
formatFileSize(1024)      // → '1.0 KB'
formatFileSize(1048576)   // → '1.0 MB' 
formatFileSize(1073741824) // → '1.0 GB'
```

---

## Hooks Personalizados

### useAppSelection

Hook para gestionar estado global de selección de aplicaciones.

```typescript
function useAppSelection(): AppSelectionState
```

**Retorna:**
```typescript
interface AppSelectionState {
  selectedApps: App[]
  toggleApp: (app: App) => void
  clearSelection: () => void
  selectMultiple: (apps: App[]) => void
  isSelected: (app: App) => boolean
  selectionCount: number
}
```

**Uso:**
```typescript
function AppGrid() {
  const { 
    selectedApps, 
    toggleApp, 
    isSelected,
    selectionCount 
  } = useAppSelection()
  
  return (
    <div>
      <h2>{selectionCount} apps selected</h2>
      {apps.map(app => (
        <AppCard
          key={app.id}
          app={app}
          isSelected={isSelected(app)}
          onToggle={toggleApp}
        />
      ))}
    </div>
  )
}
```

### useTheme

Hook para gestión de temas claro/oscuro.

```typescript
function useTheme(): ThemeState
```

**Retorna:**
```typescript
interface ThemeState {
  theme: Theme                    // 'light' | 'dark' | 'auto'
  setTheme: (theme: Theme) => void
  effectiveTheme: 'light' | 'dark'
  toggleTheme: () => void
}
```

### useDebounce

Hook para debouncing de valores (optimización de búsquedas).

```typescript
function useDebounce<T>(value: T, delay: number): T
```

**Uso:**
```typescript
function SearchInput() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery)
    }
  }, [debouncedQuery])
  
  return (
    <input 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search apps..."
    />
  )
}
```

---

## Tipos TypeScript

### Tipos Principales

#### `App`

```typescript
interface App {
  id: string                    // Identificador único
  name: string                  // Nombre display
  description: string           // Descripción corta
  category: Category           // Categoría principal
  categories?: Category[]      // Categorías secundarias
  brewId: string               // ID en Homebrew
  type?: 'formula' | 'cask'    // Tipo de instalación
  icon?: string                // URL del icono
  homepage?: string            // Website oficial
  dependencies?: string[]      // Dependencias requeridas
  size?: number               // Tamaño en bytes
  license?: string            // Tipo de licencia
  isOpenSource?: boolean      // Si es open source
}
```

#### `Category`

```typescript
type Category = 
  | 'browsers'
  | 'development' 
  | 'productivity'
  | 'multimedia'
  | 'utilities'
  | 'design'
  | 'gaming'
  | 'social'
  | 'education'
  | 'system'
```

#### `SearchResult`

```typescript
interface SearchResult {
  type: 'local' | 'api'
  app: App
  relevance: number
  matchType: 'name' | 'description' | 'category'
  snippet?: string             // Fragmento de texto que coincide
}
```

#### `ScriptOptions`

```typescript
interface ScriptOptions {
  includeUpdates?: boolean
  cleanup?: boolean
  verbose?: boolean
  architecture?: Architecture
  dryRun?: boolean
  logFile?: string
  skipExisting?: boolean       // No reinstalar apps existentes
  parallelInstall?: boolean    // Instalar en paralelo
}
```

### Tipos de Utilidad

#### `Architecture`

```typescript
type Architecture = 'arm64' | 'x86_64' | 'unknown'
```

#### `Theme`

```typescript
type Theme = 'light' | 'dark' | 'auto'
```

#### `SortOrder`

```typescript
type SortOrder = 'asc' | 'desc'
```

#### `SortField`

```typescript
type SortField = 'name' | 'category' | 'size' | 'popularity'
```

---

## 🚀 Ejemplos de Uso Avanzado

### Generación de Script Personalizado

```typescript
// Script para setup completo de desarrollador
const developmentSetup = async () => {
  const devApps = await HybridSearchService.search('development')
  
  const selectedApps = devApps
    .filter(result => result.relevance > 0.8)
    .map(result => result.app)
    .slice(0, 10)
  
  const script = ScriptGenerator.generateInstallScript(selectedApps, {
    includeUpdates: true,
    cleanup: true,
    verbose: true,
    architecture: ArchitectureDetectionService.detectArchitecture()
  })
  
  console.log('Script generado:', script)
}
```

### Búsqueda con Filtros Avanzados

```typescript
// Búsqueda de apps de diseño gratuitas
const findFreeDesignApps = async () => {
  const results = await HybridSearchService.search('design', {
    categories: ['design', 'multimedia'],
    maxResults: 20,
    minScore: 0.5
  })
  
  const freeApps = results.filter(result => 
    result.app.license === 'free' || 
    result.app.isOpenSource === true
  )
  
  return freeApps
}
```

### Migración de Datos

```typescript
// Migrar perfiles de versión anterior
const migrateProfiles = () => {
  const profiles = StorageService.loadProfiles()
  
  Object.keys(profiles).forEach(name => {
    const profile = profiles[name]
    
    if (!profile.version || profile.version < '2.0') {
      // Aplicar migración
      profile.version = '2.0'
      profile.id = generateUUID()
      
      StorageService.saveProfile(name, profile.apps)
    }
  })
}
```

---

**Esta API está diseñada para ser extensible y mantenible. Todos los métodos incluyen validación de tipos y manejo de errores robusto.** 🔧

Para más ejemplos y casos de uso, consulta los [Tests de Integración](../testing/integration.md).
