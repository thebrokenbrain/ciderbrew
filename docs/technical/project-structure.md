# 🏗️ Estructura del Proyecto

*Guía completa de la organización de archivos y carpetas en Ciderbrew*

## 📁 Vista General

```
ciderbrew/
├── 📄 README.md                    # Documentación principal
├── 📄 package.json                 # Dependencias y scripts
├── 📄 vite.config.ts               # Configuración de Vite
├── 📄 tsconfig.json                # Configuración de TypeScript
├── 📄 tailwind.config.js           # Configuración de Tailwind CSS
├── 📄 .gitignore                   # Archivos ignorados por Git
├── 📄 .eslintrc.js                 # Configuración de ESLint
├── 📄 .prettierrc                  # Configuración de Prettier
├── 📄 jest.config.js               # Configuración de Jest
│
├── 🌐 public/                      # Archivos estáticos públicos
│   ├── favicon.ico                 # Icono del sitio
│   ├── logo.png                    # Logo de Ciderbrew
│   ├── manifest.json               # PWA manifest
│   └── robots.txt                  # SEO robots
│
├── 📚 docs/                        # Documentación completa
│   ├── README.md                   # Índice de documentación
│   ├── 🏗️ architecture/           # Documentación técnica
│   ├── 📖 guides/                  # Guías de usuario y desarrollo
│   ├── 🔧 api/                     # Referencia de APIs
│   ├── 🧪 testing/                 # Estrategia de testing
│   ├── 🚀 deployment/              # Guías de deployment
│   ├── 🛠️ technical/               # Documentación técnica detallada
│   └── 📸 images/                  # Imágenes para documentación
│
├── 💻 src/                         # Código fuente principal
│   ├── 📄 main.tsx                 # Punto de entrada de la aplicación
│   ├── 📄 App.tsx                  # Componente raíz
│   ├── 📄 index.css                # Estilos globales
│   │
│   ├── 🎨 components/              # Componentes React reutilizables
│   │   ├── AppCard.tsx             # Tarjeta de aplicación
│   │   ├── Header.tsx              # Cabecera principal
│   │   ├── SearchInterface.tsx     # Interfaz de búsqueda
│   │   ├── TabNavigation.tsx       # Navegación por pestañas
│   │   ├── ProfileManager.tsx      # Gestión de perfiles
│   │   ├── ScriptSection.tsx       # Sección del generador de scripts
│   │   └── ToastContainer.tsx      # Sistema de notificaciones
│   │
│   ├── 🪝 hooks/                   # React Hooks personalizados
│   │   ├── useAppSelection.ts      # Gestión de selección de apps
│   │   ├── useTheme.ts             # Gestión de temas
│   │   ├── useLocalStorage.ts      # Persistencia local
│   │   └── useDebounce.ts          # Optimización de búsquedas
│   │
│   ├── ⚙️ services/                # Lógica de negocio y servicios
│   │   ├── ScriptGenerator.ts      # Generación de scripts bash
│   │   ├── HybridSearchService.ts  # Búsqueda híbrida
│   │   ├── StorageService.ts       # Gestión de persistencia
│   │   ├── ArchitectureDetectionService.ts # Detección de arquitectura
│   │   └── ValidationService.ts    # Validaciones
│   │
│   ├── 📊 data/                    # Datos estáticos y configuración
│   │   ├── apps.ts                 # Catálogo de aplicaciones
│   │   ├── categories.ts           # Definiciones de categorías
│   │   └── constants.ts            # Constantes globales
│   │
│   ├── 🔧 types/                   # Definiciones de tipos TypeScript
│   │   ├── app.types.ts            # Tipos relacionados con aplicaciones
│   │   ├── ui.types.ts             # Tipos de interfaz de usuario
│   │   ├── api.types.ts            # Tipos de APIs
│   │   └── index.ts                # Re-exports de tipos
│   │
│   ├── 🛠️ utils/                   # Utilidades y funciones helper
│   │   ├── formatters.ts           # Funciones de formateo
│   │   ├── validators.ts           # Funciones de validación
│   │   ├── constants.ts            # Constantes compartidas
│   │   └── helpers.ts              # Funciones auxiliares
│   │
│   └── 🧪 __tests__/               # Suite de pruebas
│       ├── components/             # Tests de componentes
│       ├── services/               # Tests de servicios
│       ├── hooks/                  # Tests de hooks
│       ├── integration/            # Tests de integración
│       ├── e2e/                    # Tests end-to-end
│       ├── utils/                  # Tests de utilidades
│       ├── test-utils.tsx          # Utilidades para testing
│       └── __snapshots__/          # Snapshots de tests
│
├── 🔧 .github/                     # Configuración de GitHub
│   ├── workflows/                  # GitHub Actions
│   │   ├── ci.yml                  # Integración continua
│   │   ├── deploy.yml              # Deploy automático
│   │   └── tests.yml               # Ejecución de tests
│   ├── ISSUE_TEMPLATE/             # Templates para issues
│   │   ├── bug_report.md           # Reporte de bugs
│   │   └── feature_request.md      # Solicitud de features
│   └── pull_request_template.md    # Template para PRs
│
├── 📦 dist/                        # Build de producción (generado)
│   ├── index.html                  # HTML principal
│   ├── assets/                     # Assets optimizados
│   │   ├── index-[hash].js         # JavaScript minificado
│   │   ├── index-[hash].css        # CSS minificado
│   │   └── [otros-assets]          # Imágenes, fuentes, etc.
│   └── manifest.json               # Manifest optimizado
│
└── 📊 coverage/                    # Reportes de cobertura (generado)
    ├── lcov-report/                # Reporte HTML
    ├── lcov.info                   # Datos de cobertura
    └── clover.xml                  # Formato XML
```

## 📄 Archivos de Configuración

### `package.json` - Dependencias y Scripts

```json
{
  "name": "ciderbrew",
  "version": "2.1.0",
  "description": "Tu asistente inteligente para configurar macOS con Homebrew",
  "scripts": {
    "dev": "vite",                    // Servidor de desarrollo
    "build": "vite build",            // Build de producción
    "preview": "vite preview",        // Preview del build
    "test": "jest",                   // Ejecutar tests
    "test:watch": "jest --watch",     // Tests en modo watch
    "test:coverage": "jest --coverage", // Tests con cobertura
    "lint": "eslint src --ext ts,tsx", // Linting
    "type-check": "tsc --noEmit"      // Verificación de tipos
  },
  "dependencies": {
    "react": "^19.0.0",               // Framework de UI
    "react-dom": "^19.0.0",           // Renderizado DOM
    "clsx": "^2.0.0"                  // Utilidad para clases CSS
  },
  "devDependencies": {
    "vite": "^5.0.0",                 // Build tool
    "typescript": "^5.0.0",           // Tipado estático
    "@types/react": "^19.0.0",        // Tipos para React
    "jest": "^29.0.0",                // Framework de testing
    "eslint": "^8.0.0",               // Linter
    "prettier": "^3.0.0",             // Formatter
    "tailwindcss": "^3.0.0"           // Framework CSS
  }
}
```

### `vite.config.ts` - Configuración de Build

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  // Alias para imports más limpios
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@services': resolve(__dirname, 'src/services'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 5173,
    open: true,
    host: '0.0.0.0'
  },
  
  // Configuración de build
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['./src/utils']
        }
      }
    }
  }
})
```

### `tsconfig.json` - TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    // Path mapping (debe coincidir con vite.config.ts)
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@services/*": ["src/services/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## 🎨 Organización de Componentes

### Estructura de Componente Típico

```typescript
// src/components/AppCard.tsx
import React from 'react'
import clsx from 'clsx'
import type { App } from '@types/app.types'

// 1. Interfaces primero
interface AppCardProps {
  app: App
  isSelected: boolean
  onToggle: (app: App) => void
  className?: string
}

// 2. Componente principal
export function AppCard({ 
  app, 
  isSelected, 
  onToggle, 
  className 
}: AppCardProps) {
  // 3. Handlers
  const handleClick = () => {
    onToggle(app)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle(app)
    }
  }
  
  // 4. Render
  return (
    <div
      className={clsx(
        'app-card',
        { 'app-card--selected': isSelected },
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <img src={app.icon} alt={app.name} />
      <h3>{app.name}</h3>
      <p>{app.description}</p>
    </div>
  )
}

// 5. Export default si es el componente principal
export default AppCard
```

### Índice de Componentes

```typescript
// src/components/index.ts
// Re-exports para imports más limpios
export { AppCard } from './AppCard'
export { Header } from './Header'
export { SearchInterface } from './SearchInterface'
export { TabNavigation } from './TabNavigation'
export { ProfileManager } from './ProfileManager'
export { ScriptSection } from './ScriptSection'
export { ToastContainer } from './ToastContainer'

// Uso:
// import { AppCard, Header } from '@components'
```

## 🪝 Organización de Hooks

### Hook Personalizado Típico

```typescript
// src/hooks/useAppSelection.ts
import { useState, useCallback, useEffect } from 'react'
import type { App } from '@types/app.types'
import { StorageService } from '@services/StorageService'

// 1. Interface del estado que retorna
interface AppSelectionState {
  selectedApps: App[]
  selectionCount: number
  isSelected: (app: App) => boolean
  toggleApp: (app: App) => void
  selectMultiple: (apps: App[]) => void
  clearSelection: () => void
}

// 2. Hook principal
export function useAppSelection(): AppSelectionState {
  // 3. Estado local
  const [selectedApps, setSelectedApps] = useState<App[]>([])
  
  // 4. Cargar estado inicial
  useEffect(() => {
    const saved = StorageService.loadSelection()
    setSelectedApps(saved)
  }, [])
  
  // 5. Persistir cambios
  useEffect(() => {
    StorageService.saveSelection(selectedApps)
  }, [selectedApps])
  
  // 6. Funciones memoizadas
  const isSelected = useCallback((app: App) => {
    return selectedApps.some(selected => selected.id === app.id)
  }, [selectedApps])
  
  const toggleApp = useCallback((app: App) => {
    setSelectedApps(current => 
      isSelected(app)
        ? current.filter(selected => selected.id !== app.id)
        : [...current, app]
    )
  }, [isSelected])
  
  // 7. Return del estado público
  return {
    selectedApps,
    selectionCount: selectedApps.length,
    isSelected,
    toggleApp,
    selectMultiple: setSelectedApps,
    clearSelection: () => setSelectedApps([])
  }
}
```

## ⚙️ Organización de Servicios

### Servicio Típico

```typescript
// src/services/ScriptGenerator.ts

// 1. Imports
import type { App, ScriptOptions } from '@types'

// 2. Clase estática para servicios sin estado
export class ScriptGenerator {
  
  // 3. Constantes privadas
  private static readonly SCRIPT_HEADER = '#!/bin/bash'
  private static readonly HOMEBREW_INSTALL_URL = 'https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh'
  
  // 4. Método principal público
  static generateInstallScript(
    apps: App[], 
    options: ScriptOptions = {}
  ): string {
    const sections = [
      this.generateHeader(),
      this.generateBrewCheck(),
      this.generateArchDetection(),
      ...apps.map(app => this.generateInstallCommand(app, options)),
      this.generateFooter(options)
    ]
    
    return sections.join('\n\n')
  }
  
  // 5. Métodos auxiliares privados
  private static generateHeader(): string {
    return `${this.SCRIPT_HEADER}
# Ciderbrew Installation Script
# Generated on: ${new Date().toISOString()}
set -e  # Exit on any error`
  }
  
  private static generateBrewCheck(): string {
    // Implementation...
  }
  
  // 6. Utilidades estáticas públicas si son útiles
  static validateApp(app: App): boolean {
    return !!(app.id && app.name && app.brewId)
  }
}
```

## 📊 Organización de Datos

### Catálogo de Aplicaciones

```typescript
// src/data/apps.ts
import type { App, Category } from '@types'

// 1. Aplicaciones organizadas por categoría
export const browserApps: App[] = [
  {
    id: 'chrome',
    name: 'Google Chrome',
    description: 'Fast, secure web browser',
    category: 'browsers',
    brewId: 'google-chrome',
    type: 'cask',
    icon: 'https://example.com/chrome.png',
    homepage: 'https://www.google.com/chrome/',
    size: 150_000_000, // bytes
    license: 'proprietary'
  },
  // ... más navegadores
]

export const developmentApps: App[] = [
  // ... apps de desarrollo
]

// 2. Exportar todas las apps
export const allApps: App[] = [
  ...browserApps,
  ...developmentApps,
  // ... otras categorías
]

// 3. Índice por ID para búsqueda rápida
export const appsById = new Map(
  allApps.map(app => [app.id, app])
)

// 4. Índice por categoría
export const appsByCategory = new Map<Category, App[]>([
  ['browsers', browserApps],
  ['development', developmentApps],
  // ... otras categorías
])
```

### Configuración de Categorías

```typescript
// src/data/categories.ts
import type { Category } from '@types'

// 1. Definición de categorías
export interface CategoryInfo {
  id: Category
  name: string
  description: string
  icon: string
  color: string
}

// 2. Metadatos de categorías
export const categories: CategoryInfo[] = [
  {
    id: 'browsers',
    name: 'Navegadores',
    description: 'Navegadores web para explorar internet',
    icon: '🌐',
    color: 'blue'
  },
  {
    id: 'development',
    name: 'Desarrollo',
    description: 'Herramientas para programación y desarrollo',
    icon: '⚡',
    color: 'green'
  },
  // ... más categorías
]

// 3. Mapeo para búsqueda rápida
export const categoriesById = new Map(
  categories.map(cat => [cat.id, cat])
)
```

## 🔧 Organización de Tipos

### Tipos de Aplicaciones

```typescript
// src/types/app.types.ts

// 1. Enums para valores fijos
export type Category = 
  | 'browsers'
  | 'development'
  | 'productivity'
  | 'multimedia'
  | 'utilities'
  | 'design'
  | 'gaming'

export type AppType = 'formula' | 'cask'
export type Architecture = 'arm64' | 'x86_64' | 'universal'

// 2. Interfaces principales
export interface App {
  // Identificación
  id: string
  name: string
  description: string
  
  // Categorización
  category: Category
  categories?: Category[]  // Categorías secundarias
  
  // Homebrew
  brewId: string
  type?: AppType
  
  // Metadatos
  icon?: string
  homepage?: string
  size?: number
  license?: string
  isOpenSource?: boolean
  
  // Dependencias
  dependencies?: string[]
  conflicts?: string[]
  
  // Arquitectura
  architecture?: Architecture
}

// 3. Tipos derivados
export interface AppWithSelection extends App {
  isSelected: boolean
}

export type AppId = App['id']
export type AppName = App['name']
```

### Tipos de UI

```typescript
// src/types/ui.types.ts

// 1. Tipos de tema
export type Theme = 'light' | 'dark' | 'auto'

// 2. Tipos de componentes
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
}

// 3. Tipos de estado de la aplicación
export interface AppState {
  selectedApps: App[]
  searchQuery: string
  activeCategory: Category | null
  theme: Theme
  isLoading: boolean
}

// 4. Tipos de eventos
export interface SearchEvent {
  query: string
  timestamp: number
  resultCount: number
}
```

## 🧪 Organización de Tests

### Test de Componente

```typescript
// src/__tests__/components/AppCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { AppCard } from '@components/AppCard'
import { createMockApp } from '../test-utils'

describe('AppCard Component', () => {
  // 1. Setup común
  const mockApp = createMockApp({
    id: 'chrome',
    name: 'Google Chrome'
  })
  
  const defaultProps = {
    app: mockApp,
    isSelected: false,
    onToggle: jest.fn()
  }
  
  // 2. Tests agrupados por funcionalidad
  describe('Rendering', () => {
    it('displays app name and description', () => {
      render(<AppCard {...defaultProps} />)
      
      expect(screen.getByText('Google Chrome')).toBeInTheDocument()
    })
  })
  
  describe('Interactions', () => {
    it('calls onToggle when clicked', () => {
      const onToggle = jest.fn()
      render(<AppCard {...defaultProps} onToggle={onToggle} />)
      
      fireEvent.click(screen.getByRole('button'))
      
      expect(onToggle).toHaveBeenCalledWith(mockApp)
    })
  })
  
  describe('Accessibility', () => {
    it('supports keyboard navigation', () => {
      // Test keyboard events
    })
  })
})
```

### Utilidades de Testing

```typescript
// src/__tests__/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import type { App, Profile } from '@types'

// 1. Factories para datos de prueba
export const createMockApp = (overrides: Partial<App> = {}): App => ({
  id: 'test-app',
  name: 'Test App',
  description: 'Test description',
  category: 'development',
  brewId: 'test-app',
  ...overrides
})

export const createMockProfile = (overrides: Partial<Profile> = {}): Profile => ({
  id: 'test-profile',
  apps: [createMockApp()],
  createdAt: new Date().toISOString(),
  version: '2.0',
  ...overrides
})

// 2. Wrapper con providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <AppSelectionProvider>
        {children}
      </AppSelectionProvider>
    </ThemeProvider>
  )
}

// 3. Render customizado
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

// 4. Re-export todo de testing library
export * from '@testing-library/react'
export { renderWithProviders as render }
```

## 📦 Build y Distribution

### Estructura del Build

```
dist/
├── index.html                      # HTML principal optimizado
├── assets/                         # Assets con hash para cache busting
│   ├── index-a1b2c3d4.js          # JavaScript bundle principal
│   ├── vendor-e5f6g7h8.js         # Libraries de terceros
│   ├── index-i9j0k1l2.css         # CSS bundle
│   └── logo-m3n4o5p6.png          # Assets optimizados
├── manifest.json                   # PWA manifest
└── robots.txt                      # SEO robots
```

### Optimizaciones de Build

```typescript
// vite.config.ts - Configuraciones de optimización
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Separar bundles por tipo
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-components': ['./src/components'],
          'services': ['./src/services'],
          'utils': ['./src/utils']
        },
        
        // Nombres con hash para cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Optimización de assets
    assetsInlineLimit: 4096,  // Inline assets < 4KB
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,     // Remover console.logs
        drop_debugger: true     // Remover debuggers
      }
    }
  }
})
```

---

## 🎯 Convenciones de Naming

### Archivos y Carpetas

```bash
# Componentes: PascalCase
AppCard.tsx
SearchInterface.tsx

# Hooks: camelCase con 'use' prefix
useAppSelection.ts
useTheme.ts

# Servicios: PascalCase con 'Service' suffix
ScriptGenerator.ts
StorageService.ts

# Tipos: camelCase con '.types' suffix
app.types.ts
ui.types.ts

# Tests: mismo nombre + '.test' suffix
AppCard.test.tsx
useAppSelection.test.ts

# Utilidades: camelCase
formatters.ts
validators.ts

# Constantes: camelCase
constants.ts
categories.ts
```

### Variables y Funciones

```typescript
// Variables: camelCase
const selectedApps = []
const isLoading = false

// Funciones: camelCase
function formatAppName() {}
const handleClick = () => {}

// Componentes: PascalCase
function AppCard() {}
const SearchInterface = () => {}

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.ciderbrew.app'
const MAX_SEARCH_RESULTS = 50

// Tipos/Interfaces: PascalCase
interface AppCardProps {}
type SearchResult = {}
```

---

## 🎓 Recursos para Entender la Estructura

### Para Nuevos Desarrolladores

1. **Empezar por**: `src/App.tsx` - Componente raíz
2. **Luego revisar**: `src/components/` - Componentes principales  
3. **Entender hooks**: `src/hooks/useAppSelection.ts` - Lógica de estado
4. **Ver servicios**: `src/services/ScriptGenerator.ts` - Lógica de negocio

### Para Contribuidores

1. **Leer**: `docs/guides/contributing.md` - Guía de contribución
2. **Revisar**: `package.json` - Scripts disponibles
3. **Entender tests**: `src/__tests__/` - Ejemplos de testing
4. **Configuración**: `vite.config.ts`, `tsconfig.json` - Setup del proyecto

### Para Arquitectos

1. **Arquitectura**: `docs/architecture/README.md` - Diseño de alto nivel
2. **APIs**: `docs/api/README.md` - Documentación técnica
3. **Performance**: `docs/technical/performance.md` - Optimizaciones
4. **Deployment**: `docs/deployment/README.md` - Estrategias de deploy

**¡Esta estructura está diseñada para ser intuitiva y escalable! 📈**
