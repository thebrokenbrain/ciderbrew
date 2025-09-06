# 🛠️ Tecnologías Utilizadas en Ciderbrew

*Una explicación completa de cada tecnología, para qué sirve, y por qué la elegimos*

## 🎯 Overview del Stack Tecnológico

Ciderbrew está construido con tecnologías modernas que priorizan:
- **Developer Experience**: Herramientas que hacen el desarrollo más rápido y placentero
- **Performance**: Aplicación rápida y eficiente
- **Mantenibilidad**: Código fácil de entender y modificar
- **Escalabilidad**: Estructura que puede crecer sin problemas

```
Frontend Stack:
React 19 + TypeScript + Vite + Tailwind CSS

Testing Stack:
Jest + React Testing Library + MSW

Tooling Stack:
ESLint + Prettier + Husky + GitHub Actions
```

## ⚛️ React 19

### ¿Qué es React?

React es una **librería de JavaScript** creada por Facebook para construir interfaces de usuario. Piensa en React como un sistema de "bloques de construcción" reutilizables para websites.

### ¿Por qué React?

**1. Componentes Reutilizables**
```jsx
// Podemos crear un componente una vez...
function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>
}

// ...y usarlo en múltiples lugares
<Button text="Instalar" onClick={handleInstall} />
<Button text="Cancelar" onClick={handleCancel} />
```

**2. Estado Reactivo**
```jsx
// Cuando el estado cambia, la UI se actualiza automáticamente
const [selectedApps, setSelectedApps] = useState([])

// Agregar una app actualiza automáticamente la interfaz
const addApp = (app) => setSelectedApps([...selectedApps, app])
```

**3. Ecosistema Maduro**
- Millones de desarrolladores lo usan
- Abundante documentación y recursos
- Herramientas de desarrollo excelentes

### Características de React 19

**Server Components**
```jsx
// Componentes que se renderizan en el servidor
async function AppList() {
  const apps = await fetchApps() // Esto corre en el servidor
  return <div>{apps.map(app => <AppCard key={app.id} app={app} />)}</div>
}
```

**Concurrent Features**
```jsx
// Renderizado no bloqueante para mejor UX
import { startTransition } from 'react'

const handleSearch = (query) => {
  startTransition(() => {
    // Búsqueda pesada que no bloquea la UI
    setSearchResults(heavySearchFunction(query))
  })
}
```

**Improved Hooks**
```jsx
// useOptimistic para actualizaciones optimistas
const [optimisticApps, addOptimistic] = useOptimistic(
  selectedApps,
  (state, app) => [...state, app]
)
```

## 📘 TypeScript

### ¿Qué es TypeScript?

TypeScript es **JavaScript con tipos**. Es como tener un asistente que te avisa de errores antes de que ocurran.

### JavaScript vs TypeScript

**JavaScript (sin tipos):**
```javascript
// ¿Qué tipo de datos espera esta función? No sabemos.
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// Error en runtime: item.price puede ser undefined
calculateTotal([{ name: "App" }]) // 💥 Error!
```

**TypeScript (con tipos):**
```typescript
interface Item {
  name: string
  price: number
}

// Ahora sabemos exactamente qué espera la función
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// Error detectado ANTES de ejecutar
calculateTotal([{ name: "App" }]) // ❌ Error: Missing 'price'
```

### Beneficios en Ciderbrew

**1. Prevención de Errores**
```typescript
interface App {
  id: string
  name: string
  category: Category
  isSelected?: boolean // Opcional
}

// TypeScript nos ayuda a usar correctamente los tipos
const selectApp = (app: App) => {
  // TypeScript sabe que app.name existe
  console.log(`Seleccionando ${app.name}`)
  
  // Y nos avisa si tratamos de acceder a algo que no existe
  console.log(app.price) // ❌ Error: Property 'price' does not exist
}
```

**2. Autocompletado Inteligente**
```typescript
// Al escribir "app.", el editor muestra todas las propiedades disponibles
app.name      // ✅ string
app.category  // ✅ Category
app.id        // ✅ string
```

**3. Refactoring Seguro**
```typescript
// Si cambiamos el nombre de una propiedad...
interface App {
  identifier: string // Antes era 'id'
  name: string
}

// TypeScript encuentra TODOS los lugares que necesitan actualizarse
// ❌ Error en todos los lugares que usan 'app.id'
```

### Tipos Específicos de Ciderbrew

```typescript
// Tipos de aplicaciones
export interface App {
  id: string
  name: string
  description: string
  category: Category
  brewId: string
  icon?: string
  homepage?: string
  dependencies?: string[]
}

// Tipos de búsqueda
export interface SearchResult {
  type: 'local' | 'api'
  app: App
  relevance: number
}

// Tipos de configuración
export interface ScriptOptions {
  includeUpdates: boolean
  cleanup: boolean
  verbose: boolean
  architecture: 'auto' | 'x86_64' | 'arm64'
}
```

## ⚡ Vite

### ¿Qué es Vite?

Vite es una **herramienta de desarrollo** que hace que trabajar con código frontend sea súper rápido. Es como tener un asistente que:
- Inicia tu proyecto instantáneamente
- Muestra cambios al instante
- Prepara tu app para producción

### ¿Por qué es tan Rápido?

**Hot Module Replacement (HMR)**
```
Cambias código → Vite detecta el cambio → Actualiza solo esa parte → Navegador muestra cambio
                 (instantáneo)        (sin recargar página)    (preservando estado)
```

**Comparación de Velocidad:**
```
Herramienta Tradicional (Webpack):
Start: 30-60 segundos
Rebuild: 5-10 segundos

Vite:
Start: 1-3 segundos
Rebuild: <1 segundo
```

### Configuración de Vite en Ciderbrew

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),                    // Soporte para React
    tailwindcss(),             // Integración con Tailwind
  ],
  server: {
    port: 5173,                // Puerto de desarrollo
    open: true,                // Abrir navegador automáticamente
    host: '0.0.0.0'           // Accesible desde red local
  },
  build: {
    outDir: 'dist',            // Carpeta de salida
    sourcemap: true,           // Maps para debugging
    rollupOptions: {
      output: {
        manualChunks: {          // Optimización de bundles
          vendor: ['react', 'react-dom'],
          utils: ['./src/utils'],
        }
      }
    }
  }
})
```

### Características Avanzadas

**Bundling Inteligente:**
```
src/
├── components/     → components-[hash].js
├── services/      → services-[hash].js  
└── utils/         → utils-[hash].js

// Solo descarga lo que necesita cada página
```

**Tree Shaking:**
```typescript
// Solo importa lo que usas
import { debounce } from 'lodash'  // ❌ Importa toda la librería (500kb)
import debounce from 'lodash.debounce'  // ✅ Solo la función (5kb)
```

## 🎨 Tailwind CSS

### ¿Qué es Tailwind CSS?

Tailwind es un **framework de CSS utilitario**. En lugar de escribir CSS personalizado, usas clases predefinidas que ya tienen estilos aplicados.

### CSS Tradicional vs Tailwind

**CSS Tradicional:**
```css
/* Tienes que escribir y mantener este CSS */
.button {
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
}

.button:hover {
  background-color: darkblue;
}
```

**Tailwind:**
```html
<!-- Todo en una línea, sin CSS personalizado -->
<button class="bg-blue-500 text-white px-4 py-2 rounded border-none hover:bg-blue-700">
  Click me
</button>
```

### Ventajas de Tailwind

**1. Desarrollo Más Rápido**
```html
<!-- Estilos aplicados inmediatamente -->
<div class="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg">
  <h2 class="text-xl font-bold text-gray-800">Título</h2>
  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Acción
  </button>
</div>
```

**2. Consistencia Automática**
```html
<!-- Todos estos elementos usan la misma escala de espaciado -->
<div class="p-2">   <!-- 8px padding -->
<div class="p-4">   <!-- 16px padding -->
<div class="p-6">   <!-- 24px padding -->
<div class="p-8">   <!-- 32px padding -->
```

**3. Responsive Design Fácil**
```html
<!-- Mobile-first design con breakpoints -->
<div class="
  w-full           <!-- Full width en mobile -->
  md:w-1/2         <!-- Half width en tablet -->
  lg:w-1/3         <!-- Third width en desktop -->
  xl:w-1/4         <!-- Quarter width en pantallas grandes -->
">
```

### Configuración en Ciderbrew

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores personalizados de Ciderbrew
        'ciderbrew-green': {
          50: '#f0f9f4',
          500: '#10b981',
          700: '#047857',
        },
        'ciderbrew-dark': {
          900: '#111827',
          800: '#1f2937',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),        // Estilos para formularios
    require('@tailwindcss/typography'),   // Estilos para texto
  ],
  darkMode: 'class', // Modo oscuro controlado por clase
}
```

### Ejemplo de Componente con Tailwind

```tsx
function AppCard({ app, isSelected }: AppCardProps) {
  return (
    <div className={`
      relative p-6 rounded-xl border-2 cursor-pointer
      transition-all duration-200 hover:shadow-lg
      ${isSelected 
        ? 'border-ciderbrew-green-500 bg-ciderbrew-green-50 dark:bg-ciderbrew-green-900/20' 
        : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
      }
    `}>
      {/* Indicador de selección */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-ciderbrew-green-500 rounded-full flex items-center justify-center">
          <CheckIcon className="w-4 h-4 text-white" />
        </div>
      )}
      
      {/* Icono de la app */}
      <img 
        src={app.icon} 
        alt={app.name}
        className="w-12 h-12 rounded-lg object-cover"
      />
      
      {/* Información */}
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        {app.name}
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
        {app.description}
      </p>
      
      {/* Categorías */}
      <div className="mt-4 flex flex-wrap gap-2">
        {app.categories.map(category => (
          <span 
            key={category}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
          >
            {category}
          </span>
        ))}
      </div>
    </div>
  )
}
```

## 🧪 Jest + React Testing Library

### ¿Por qué Testing?

Los tests son como **seguros para tu código**. Te aseguran que cuando cambias algo, no rompes otra cosa.

### Jest - Framework de Testing

**¿Qué es Jest?**
Jest es el "motor" que ejecuta las pruebas.

```typescript
// Ejemplo de test unitario
describe('ScriptGenerator', () => {
  test('should generate valid bash script', () => {
    const apps = [
      { id: '1', name: 'Chrome', brewId: 'google-chrome' }
    ]
    
    const script = ScriptGenerator.generateInstallScript(apps, {})
    
    expect(script).toContain('brew install --cask google-chrome')
    expect(script).toContain('#!/bin/bash')
  })
  
  test('should handle empty app list', () => {
    const script = ScriptGenerator.generateInstallScript([], {})
    
    expect(script).not.toContain('brew install')
    expect(script).toContain('echo "No applications selected"')
  })
})
```

### React Testing Library - Testing de UI

**¿Qué es RTL?**
React Testing Library te permite probar componentes como lo haría un usuario real.

```typescript
// Test de componente
test('AppCard should toggle selection when clicked', () => {
  const mockApp = {
    id: '1',
    name: 'Visual Studio Code',
    description: 'Code editor'
  }
  const mockToggle = jest.fn()
  
  render(
    <AppCard 
      app={mockApp} 
      isSelected={false} 
      onToggle={mockToggle} 
    />
  )
  
  // Encontrar el componente como lo haría un usuario
  const card = screen.getByText('Visual Studio Code')
  
  // Hacer clic como lo haría un usuario
  fireEvent.click(card)
  
  // Verificar que se llamó la función
  expect(mockToggle).toHaveBeenCalledWith(mockApp)
})
```

### Tipos de Tests en Ciderbrew

**1. Tests Unitarios**
```typescript
// Probar funciones individuales
test('formatAppName should capitalize correctly', () => {
  expect(formatAppName('visual-studio-code')).toBe('Visual Studio Code')
})
```

**2. Tests de Integración**
```typescript
// Probar múltiples componentes trabajando juntos
test('search should update app grid', async () => {
  render(<App />)
  
  const searchInput = screen.getByPlaceholderText('Search apps...')
  fireEvent.change(searchInput, { target: { value: 'chrome' } })
  
  await waitFor(() => {
    expect(screen.getByText('Google Chrome')).toBeInTheDocument()
  })
})
```

**3. Tests de Snapshot**
```typescript
// Detectar cambios no intencionados en UI
test('AppCard should match snapshot', () => {
  const tree = renderer.create(
    <AppCard app={mockApp} isSelected={false} onToggle={jest.fn()} />
  ).toJSON()
  
  expect(tree).toMatchSnapshot()
})
```

## 🔧 Herramientas de Desarrollo

### ESLint - Linter

**¿Qué hace?**
ESLint encuentra errores y problemas de estilo en tu código automáticamente.

```typescript
// ESLint detecta estos problemas:
const unusedVariable = 'hello'        // ❌ Variable no usada
if (condition = true) { }             // ❌ Asignación en lugar de comparación
console.log('Debug message')          // ⚠️ Console.log olvidado
```

**Configuración:**
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@typescript-eslint/recommended',  // Reglas para TypeScript
    'plugin:react/recommended',        // Reglas para React
    'plugin:react-hooks/recommended'   // Reglas para Hooks
  ],
  rules: {
    'no-console': 'warn',              // Avisar sobre console.logs
    'react/prop-types': 'off',         // No necesario con TypeScript
    '@typescript-eslint/no-unused-vars': 'error'
  }
}
```

### Prettier - Formateador

**¿Qué hace?**
Prettier formatea tu código automáticamente para que sea consistente.

```typescript
// Antes (código desordenado)
const obj={name:"John",age:30,city:"NYC"}
if(condition){
doSomething()
}

// Después (Prettier lo arregla automáticamente)
const obj = {
  name: "John",
  age: 30,
  city: "NYC"
}

if (condition) {
  doSomething()
}
```

### Husky - Git Hooks

**¿Qué hace?**
Husky ejecuta scripts automáticamente cuando haces commits o push.

```json
// .husky/pre-commit
#!/usr/bin/env sh
npm run lint       # Verificar código
npm test          # Ejecutar tests
npm run type-check # Verificar tipos
```

## 🌐 APIs y Servicios Externos

### Homebrew Formulae API

**¿Qué es?**
API oficial de Homebrew que proporciona información sobre todas las aplicaciones disponibles.

```typescript
// Endpoint principal
const HOMEBREW_API = 'https://formulae.brew.sh/api'

// Búsqueda de aplicaciones
const searchApps = async (query: string) => {
  const response = await fetch(`${HOMEBREW_API}/formula.json`)
  const formulas = await response.json()
  
  return formulas.filter(formula => 
    formula.name.includes(query) || 
    formula.desc.toLowerCase().includes(query.toLowerCase())
  )
}

// Información específica de una app
const getAppInfo = async (formulaName: string) => {
  const response = await fetch(`${HOMEBREW_API}/formula/${formulaName}.json`)
  return response.json()
}
```

### LocalStorage - Persistencia

**¿Qué es?**
Almacenamiento local del navegador para guardar datos sin servidor.

```typescript
// Guardar datos
localStorage.setItem('ciderbrew_apps', JSON.stringify(selectedApps))

// Recuperar datos
const savedApps = JSON.parse(localStorage.getItem('ciderbrew_apps') || '[]')

// Escuchar cambios (sincronización entre tabs)
window.addEventListener('storage', (e) => {
  if (e.key === 'ciderbrew_apps') {
    setSelectedApps(JSON.parse(e.newValue || '[]'))
  }
})
```

## 📦 Gestión de Dependencias

### Package.json

```json
{
  "dependencies": {
    "react": "^19.0.0",              // Librería principal
    "react-dom": "^19.0.0",          // Renderizado DOM
    "typescript": "^5.0.0",          // Tipado estático
    "@types/react": "^19.0.0"        // Tipos para React
  },
  "devDependencies": {
    "vite": "^5.0.0",                // Build tool
    "jest": "^29.0.0",               // Testing framework
    "eslint": "^8.0.0",              // Linter
    "prettier": "^3.0.0",            // Formatter
    "husky": "^8.0.0"                // Git hooks
  }
}
```

### Versionado Semántico

```
Version: MAJOR.MINOR.PATCH (ej: 2.1.4)

MAJOR: Cambios que rompen compatibilidad (2.0.0 → 3.0.0)
MINOR: Nuevas funcionalidades (2.1.0 → 2.2.0)  
PATCH: Bug fixes (2.1.4 → 2.1.5)

^ significa "compatible": ^2.1.0 acepta 2.1.x y 2.2.x pero no 3.0.0
~ significa "aproximadamente": ~2.1.0 acepta 2.1.x pero no 2.2.0
```

## 🔄 Flujo de Desarrollo

### 1. Desarrollo Local
```bash
npm run dev        # Inicia servidor de desarrollo
npm run test:watch # Tests en modo continuo
```

### 2. Pre-commit
```bash
# Automático con Husky
git commit -m "feat: nueva funcionalidad"
# → ESLint verifica código
# → Prettier formatea archivos  
# → Tests se ejecutan
# → Si todo pasa, commit se completa
```

### 3. Build de Producción
```bash
npm run build      # Genera archivos optimizados
npm run preview    # Previsualiza build localmente
```

### 4. Deployment
```bash
# Build automático en CI/CD
# Tests de integración
# Deploy a hosting estático
```

---

## 🎓 Recursos para Aprender Más

### React
- **[React Docs](https://react.dev)** - Documentación oficial
- **[React Tutorial](https://react.dev/learn)** - Tutorial interactivo

### TypeScript  
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Guía completa
- **[TypeScript Playground](https://www.typescriptlang.org/play)** - Practica online

### Vite
- **[Vite Guide](https://vitejs.dev/guide/)** - Guía oficial
- **[Vite Plugins](https://vitejs.dev/plugins/)** - Plugins disponibles

### Tailwind CSS
- **[Tailwind Docs](https://tailwindcss.com/docs)** - Documentación completa
- **[Tailwind UI](https://tailwindui.com/)** - Componentes premade

### Testing
- **[Jest Docs](https://jestjs.io/docs/getting-started)** - Framework de testing
- **[Testing Library](https://testing-library.com/)** - Testing de UI

**¡Con estas tecnologías, Ciderbrew es una aplicación moderna, rápida y mantenible! 🚀**
