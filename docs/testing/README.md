# 🧪 Estrategia de Testing

*Guía completa del sistema de pruebas de Ciderbrew*

## 🎯 Filosofía de Testing

En Ciderbrew creemos que las pruebas son **documentación ejecutable** que:
- Garantiza que el código funciona como se espera
- Previene regresiones cuando agregamos nuevas funcionalidades
- Facilita el refactoring seguro
- Sirve como documentación de cómo usar cada función

## 📊 Cobertura Actual

```
Total Coverage: 95.3%
├── Components: 97.1%
├── Services: 94.8%
├── Hooks: 98.2%
├── Utils: 92.4%
└── Integration: 89.7%

Total Tests: 118 ✅
├── Unit Tests: 89
├── Integration Tests: 19
├── E2E Tests: 7
└── Visual Regression: 3
```

## 🏗️ Arquitectura de Testing

### Pirámide de Testing

```
        /\
       /  \    E2E Tests (7)
      /____\   ↳ Flujos críticos completos
     /      \
    / Integration \ (19)
   /___Tests____\  ↳ Múltiples componentes juntos
  /              \
 /   Unit Tests   \ (89)
/________________\  ↳ Funciones y componentes individuales
```

### Tipos de Tests

#### 1. **Unit Tests** (Pruebas Unitarias)
- **Qué prueban**: Funciones y componentes individuales
- **Velocidad**: Muy rápidas (< 1ms cada una)
- **Scope**: Una función o componente aislado

#### 2. **Integration Tests** (Pruebas de Integración) 
- **Qué prueban**: Múltiples componentes trabajando juntos
- **Velocidad**: Rápidas (< 10ms cada una)
- **Scope**: Flujos de usuario específicos

#### 3. **E2E Tests** (Pruebas End-to-End)
- **Qué prueban**: Aplicación completa como la usa un usuario
- **Velocidad**: Lentas (1-5 segundos cada una)
- **Scope**: Casos de uso críticos completos

## 🧪 Stack de Testing

### Jest - Test Runner
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',              // Simula navegador
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test-utils.tsx'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
}
```

### React Testing Library
```typescript
// Filosofía: Probar como usuario real
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// ✅ Buena práctica: Buscar por texto visible
screen.getByText('Install Apps')

// ✅ Buena práctica: Buscar por rol
screen.getByRole('button', { name: 'Generate Script' })

// ❌ Mala práctica: Buscar por clase CSS
document.querySelector('.btn-primary')
```

### MSW (Mock Service Worker)
```typescript
// Simular APIs sin servidor real
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('https://formulae.brew.sh/api/formula.json', (req, res, ctx) => {
    return res(ctx.json([
      { name: 'chrome', desc: 'Google Chrome browser' }
    ]))
  })
)
```

## 📁 Estructura de Tests

```
src/__tests__/
├── 🧩 components/              # Tests de componentes UI
│   ├── AppCard.test.tsx       # Tarjeta de aplicación
│   ├── Header.test.tsx        # Cabecera principal
│   ├── SearchInterface.test.tsx # Búsqueda
│   └── ProfileManager.test.tsx # Gestión de perfiles
│
├── ⚙️ services/               # Tests de lógica de negocio
│   ├── ScriptGenerator.test.ts # Generación de scripts
│   ├── HybridSearchService.test.ts # Búsqueda híbrida
│   └── StorageService.test.ts # Persistencia
│
├── 🪝 hooks/                  # Tests de React Hooks
│   ├── useAppSelection.test.ts # Selección de apps
│   ├── useTheme.test.ts       # Gestión de temas
│   └── useDebounce.test.ts    # Optimización
│
├── 🔧 utils/                  # Tests de utilidades
│   ├── formatters.test.ts     # Formateo de datos
│   └── validators.test.ts     # Validaciones
│
├── 🔗 integration/            # Tests de integración
│   ├── search-flow.test.tsx   # Flujo de búsqueda completo
│   ├── script-generation.test.tsx # Generación completa
│   └── profile-management.test.tsx # Gestión de perfiles
│
├── 🌐 e2e/                    # Tests end-to-end
│   ├── user-journey.test.ts   # Viaje completo del usuario
│   └── critical-paths.test.ts # Flujos críticos
│
└── 📸 __snapshots__/          # Visual regression tests
    ├── AppCard.test.tsx.snap
    └── Header.test.tsx.snap
```

## 🧩 Testing de Componentes

### Ejemplo: AppCard Component

```typescript
// AppCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { AppCard } from '../components/AppCard'

describe('AppCard', () => {
  const mockApp = {
    id: '1',
    name: 'Visual Studio Code',
    description: 'Code editor by Microsoft',
    category: 'development',
    brewId: 'visual-studio-code'
  }

  it('renders app information correctly', () => {
    render(
      <AppCard 
        app={mockApp} 
        isSelected={false} 
        onToggle={jest.fn()} 
      />
    )

    // Verificar que el nombre aparece
    expect(screen.getByText('Visual Studio Code')).toBeInTheDocument()
    
    // Verificar que la descripción aparece
    expect(screen.getByText('Code editor by Microsoft')).toBeInTheDocument()
    
    // Verificar que el icono tiene alt text correcto
    expect(screen.getByAltText('Visual Studio Code')).toBeInTheDocument()
  })

  it('shows selected state visually', () => {
    render(
      <AppCard 
        app={mockApp} 
        isSelected={true} 
        onToggle={jest.fn()} 
      />
    )

    const card = screen.getByRole('button')
    expect(card).toHaveClass('selected')
  })

  it('calls onToggle when clicked', () => {
    const mockToggle = jest.fn()
    
    render(
      <AppCard 
        app={mockApp} 
        isSelected={false} 
        onToggle={mockToggle} 
      />
    )

    fireEvent.click(screen.getByRole('button'))
    
    expect(mockToggle).toHaveBeenCalledWith(mockApp)
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard navigation', () => {
    const mockToggle = jest.fn()
    
    render(
      <AppCard 
        app={mockApp} 
        isSelected={false} 
        onToggle={mockToggle} 
      />
    )

    const card = screen.getByRole('button')
    
    // Simular Enter key
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' })
    expect(mockToggle).toHaveBeenCalledWith(mockApp)
    
    // Simular Space key
    fireEvent.keyDown(card, { key: ' ', code: 'Space' })
    expect(mockToggle).toHaveBeenCalledTimes(2)
  })
})
```

### Patrones de Testing de Componentes

#### 1. **Arrange, Act, Assert (AAA)**
```typescript
it('should update search results when query changes', async () => {
  // Arrange: Configurar estado inicial
  render(<SearchInterface />)
  const searchInput = screen.getByRole('textbox')

  // Act: Realizar acción
  fireEvent.change(searchInput, { target: { value: 'chrome' } })

  // Assert: Verificar resultado
  await waitFor(() => {
    expect(screen.getByText('Google Chrome')).toBeInTheDocument()
  })
})
```

#### 2. **Testing de Props**
```typescript
const testCases = [
  { isSelected: true, expectedClass: 'selected' },
  { isSelected: false, expectedClass: 'unselected' }
]

testCases.forEach(({ isSelected, expectedClass }) => {
  it(`renders ${expectedClass} state when isSelected is ${isSelected}`, () => {
    render(<AppCard app={mockApp} isSelected={isSelected} onToggle={jest.fn()} />)
    expect(screen.getByRole('button')).toHaveClass(expectedClass)
  })
})
```

#### 3. **Testing de Estados**
```typescript
it('handles loading state correctly', () => {
  render(<SearchInterface isLoading={true} />)
  
  expect(screen.getByText('Searching...')).toBeInTheDocument()
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})
```

## ⚙️ Testing de Servicios

### Ejemplo: ScriptGenerator Service

```typescript
// ScriptGenerator.test.ts
import { ScriptGenerator } from '../services/ScriptGenerator'

describe('ScriptGenerator', () => {
  const mockApps = [
    { id: '1', name: 'Chrome', brewId: 'google-chrome', type: 'cask' },
    { id: '2', name: 'Git', brewId: 'git', type: 'formula' }
  ]

  describe('generateInstallScript', () => {
    it('generates valid bash script', () => {
      const script = ScriptGenerator.generateInstallScript(mockApps)

      // Verificar header bash
      expect(script).toMatch(/^#!/bin/bash/)
      
      // Verificar comandos de instalación
      expect(script).toContain('brew install --cask google-chrome')
      expect(script).toContain('brew install git')
      
      // Verificar estructura
      expect(script).toContain('echo "🍺 Installing')
      expect(script).toContain('echo "✅ Installation completed"')
    })

    it('handles empty app list', () => {
      const script = ScriptGenerator.generateInstallScript([])

      expect(script).toContain('echo "No applications selected"')
      expect(script).not.toContain('brew install')
    })

    it('includes homebrew check', () => {
      const script = ScriptGenerator.generateInstallScript(mockApps)

      expect(script).toContain('if ! command -v brew')
      expect(script).toContain('Installing Homebrew')
    })

    it('detects architecture correctly', () => {
      const script = ScriptGenerator.generateInstallScript(mockApps)

      expect(script).toContain('ARCH=$(uname -m)')
      expect(script).toContain('if [[ "$ARCH" == "arm64" ]]')
    })

    it('applies options correctly', () => {
      const options = {
        verbose: true,
        cleanup: true,
        includeUpdates: true
      }

      const script = ScriptGenerator.generateInstallScript(mockApps, options)

      expect(script).toContain('--verbose')
      expect(script).toContain('brew cleanup')
      expect(script).toContain('brew update')
    })
  })

  describe('generateInstallCommand', () => {
    it('generates cask command for GUI apps', () => {
      const app = { brewId: 'chrome', type: 'cask' }
      const command = ScriptGenerator.generateInstallCommand(app)

      expect(command).toBe('brew install --cask chrome')
    })

    it('generates formula command for CLI tools', () => {
      const app = { brewId: 'git', type: 'formula' }
      const command = ScriptGenerator.generateInstallCommand(app)

      expect(command).toBe('brew install git')
    })
  })
})
```

### Testing de Funciones Async

```typescript
describe('HybridSearchService', () => {
  it('combines local and API results', async () => {
    // Mock API response
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve([
        { name: 'firefox', desc: 'Mozilla Firefox' }
      ])
    })

    const results = await HybridSearchService.search('browser')

    expect(results).toHaveLength(2) // local + API
    expect(results[0].type).toBe('local')
    expect(results[1].type).toBe('api')
  })

  it('handles API errors gracefully', async () => {
    // Mock API failure
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

    const results = await HybridSearchService.search('browser')

    // Should still return local results
    expect(results.length).toBeGreaterThan(0)
    expect(results.every(r => r.type === 'local')).toBe(true)
  })
})
```

## 🪝 Testing de Hooks

### Ejemplo: useAppSelection Hook

```typescript
// useAppSelection.test.ts
import { renderHook, act } from '@testing-library/react'
import { useAppSelection } from '../hooks/useAppSelection'

describe('useAppSelection', () => {
  const mockApp = {
    id: '1',
    name: 'Chrome',
    brewId: 'google-chrome'
  }

  it('starts with empty selection', () => {
    const { result } = renderHook(() => useAppSelection())

    expect(result.current.selectedApps).toEqual([])
    expect(result.current.selectionCount).toBe(0)
  })

  it('adds app to selection', () => {
    const { result } = renderHook(() => useAppSelection())

    act(() => {
      result.current.toggleApp(mockApp)
    })

    expect(result.current.selectedApps).toContain(mockApp)
    expect(result.current.selectionCount).toBe(1)
    expect(result.current.isSelected(mockApp)).toBe(true)
  })

  it('removes app from selection when toggled again', () => {
    const { result } = renderHook(() => useAppSelection())

    // Add app
    act(() => {
      result.current.toggleApp(mockApp)
    })

    // Remove app
    act(() => {
      result.current.toggleApp(mockApp)
    })

    expect(result.current.selectedApps).not.toContain(mockApp)
    expect(result.current.selectionCount).toBe(0)
    expect(result.current.isSelected(mockApp)).toBe(false)
  })

  it('clears all selection', () => {
    const { result } = renderHook(() => useAppSelection())

    // Add multiple apps
    act(() => {
      result.current.selectMultiple([mockApp, { ...mockApp, id: '2' }])
    })

    expect(result.current.selectionCount).toBe(2)

    // Clear all
    act(() => {
      result.current.clearSelection()
    })

    expect(result.current.selectedApps).toEqual([])
    expect(result.current.selectionCount).toBe(0)
  })
})
```

## 🔗 Testing de Integración

### Ejemplo: Flujo de Búsqueda Completo

```typescript
// search-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { App } from '../App'

describe('Search Flow Integration', () => {
  beforeEach(() => {
    // Setup MSW para simular API
    server.use(
      rest.get('https://formulae.brew.sh/api/formula.json', (req, res, ctx) => {
        return res(ctx.json([
          { name: 'firefox', desc: 'Mozilla Firefox browser' }
        ]))
      })
    )
  })

  it('completes full search and selection flow', async () => {
    render(<App />)

    // 1. Usuario busca una aplicación
    const searchInput = screen.getByPlaceholderText('Search applications...')
    fireEvent.change(searchInput, { target: { value: 'browser' } })

    // 2. Esperar resultados de búsqueda
    await waitFor(() => {
      expect(screen.getByText('Google Chrome')).toBeInTheDocument()
      expect(screen.getByText('Mozilla Firefox')).toBeInTheDocument()
    })

    // 3. Usuario selecciona aplicaciones
    fireEvent.click(screen.getByText('Google Chrome'))
    fireEvent.click(screen.getByText('Mozilla Firefox'))

    // 4. Verificar contador de selección
    expect(screen.getByText('2 apps selected')).toBeInTheDocument()

    // 5. Usuario genera script
    fireEvent.click(screen.getByText('Generate Script'))

    // 6. Verificar que el script se genera
    await waitFor(() => {
      expect(screen.getByText('Script generated successfully')).toBeInTheDocument()
    })

    // 7. Verificar contenido del script
    const scriptPreview = screen.getByTestId('script-preview')
    expect(scriptPreview).toHaveTextContent('brew install --cask google-chrome')
    expect(scriptPreview).toHaveTextContent('brew install firefox')
  })

  it('handles search with no results', async () => {
    render(<App />)

    const searchInput = screen.getByPlaceholderText('Search applications...')
    fireEvent.change(searchInput, { target: { value: 'nonexistentapp' } })

    await waitFor(() => {
      expect(screen.getByText('No applications found')).toBeInTheDocument()
    })
  })
})
```

## 🌐 Testing End-to-End

### Configuración con Playwright

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
})
```

### Ejemplo E2E Test

```typescript
// e2e/user-journey.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Complete User Journey', () => {
  test('user can search, select, and generate script', async ({ page }) => {
    // 1. Navegar a la aplicación
    await page.goto('/')

    // 2. Verificar que la página carga
    await expect(page.locator('h1')).toContainText('Ciderbrew')

    // 3. Buscar aplicaciones
    await page.fill('[placeholder="Search applications..."]', 'code')
    
    // 4. Esperar resultados
    await expect(page.locator('[data-testid="app-card"]')).toHaveCount(3, { timeout: 5000 })

    // 5. Seleccionar Visual Studio Code
    await page.click('text=Visual Studio Code')
    
    // 6. Verificar selección visual
    await expect(page.locator('[data-testid="app-card"]:has-text("Visual Studio Code")')).toHaveClass(/selected/)

    // 7. Verificar contador
    await expect(page.locator('[data-testid="selection-count"]')).toContainText('1 app selected')

    // 8. Generar script
    await page.click('text=Generate Script')

    // 9. Verificar descarga (en navegador real se descargaría)
    const downloadPromise = page.waitForEvent('download')
    await page.click('text=Download Script')
    const download = await downloadPromise

    // 10. Verificar nombre del archivo
    expect(download.suggestedFilename()).toBe('install-apps.sh')
  })

  test('user can manage profiles', async ({ page }) => {
    await page.goto('/')

    // Seleccionar algunas apps
    await page.click('text=Visual Studio Code')
    await page.click('text=Google Chrome')

    // Abrir gestión de perfiles
    await page.click('text=Profiles')

    // Guardar perfil
    await page.fill('[placeholder="Profile name"]', 'Development Setup')
    await page.click('text=Save Profile')

    // Verificar confirmación
    await expect(page.locator('text=Profile saved successfully')).toBeVisible()

    // Limpiar selección
    await page.click('text=Clear Selection')

    // Cargar perfil
    await page.selectOption('[data-testid="profile-select"]', 'Development Setup')
    
    // Verificar que se restauró la selección
    await expect(page.locator('[data-testid="selection-count"]')).toContainText('2 apps selected')
  })
})
```

## 📸 Visual Regression Testing

### Setup con Jest y jest-image-snapshot

```typescript
// visual-regression.test.tsx
import { render } from '@testing-library/react'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

expect.extend({ toMatchImageSnapshot })

describe('Visual Regression Tests', () => {
  it('AppCard matches visual snapshot', () => {
    const { container } = render(
      <AppCard 
        app={mockApp} 
        isSelected={false} 
        onToggle={jest.fn()} 
      />
    )

    expect(container.firstChild).toMatchImageSnapshot({
      threshold: 0.2,
      thresholdType: 'percent'
    })
  })

  it('Header in dark mode matches snapshot', () => {
    const { container } = render(
      <div data-theme="dark">
        <Header />
      </div>
    )

    expect(container.firstChild).toMatchImageSnapshot()
  })
})
```

## 🚀 Estrategias Avanzadas

### Test-Driven Development (TDD)

```typescript
// 1. Red: Escribir test que falla
describe('formatAppName', () => {
  it('should convert kebab-case to Title Case', () => {
    expect(formatAppName('visual-studio-code')).toBe('Visual Studio Code')
  })
})

// 2. Green: Implementar mínimo para que pase
export const formatAppName = (name: string) => {
  return name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

// 3. Refactor: Mejorar implementación
export const formatAppName = (name: string) => {
  const specialCases = {
    'nodejs': 'Node.js',
    'vscode': 'Visual Studio Code'
  }
  
  return specialCases[name] || name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}
```

### Property-Based Testing

```typescript
import fc from 'fast-check'

describe('formatAppName property tests', () => {
  it('should always return a string', () => {
    fc.assert(fc.property(fc.string(), (input) => {
      const result = formatAppName(input)
      expect(typeof result).toBe('string')
    }))
  })

  it('should handle any valid app ID format', () => {
    const validAppId = fc.stringOf(
      fc.oneof(fc.char(), fc.constant('-')),
      { minLength: 1, maxLength: 50 }
    )

    fc.assert(fc.property(validAppId, (appId) => {
      const result = formatAppName(appId)
      expect(result.length).toBeGreaterThan(0)
      expect(result).not.toContain('--')
    }))
  })
})
```

### Testing de Performance

```typescript
import { performance } from 'perf_hooks'

describe('Performance Tests', () => {
  it('search should complete within 500ms', async () => {
    const start = performance.now()
    
    const results = await HybridSearchService.search('development')
    
    const duration = performance.now() - start
    expect(duration).toBeLessThan(500)
    expect(results.length).toBeGreaterThan(0)
  })

  it('script generation should be fast', () => {
    const apps = Array.from({ length: 100 }, (_, i) => ({
      id: i.toString(),
      name: `App ${i}`,
      brewId: `app-${i}`
    }))

    const start = performance.now()
    const script = ScriptGenerator.generateInstallScript(apps)
    const duration = performance.now() - start

    expect(duration).toBeLessThan(100)
    expect(script.length).toBeGreaterThan(1000)
  })
})
```

## 🔧 Utilidades de Testing

### Test Helpers

```typescript
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '../contexts/ThemeContext'
import { AppSelectionProvider } from '../contexts/AppSelectionContext'

// Wrapper personalizado con providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <AppSelectionProvider>
        {children}
      </AppSelectionProvider>
    </ThemeProvider>
  )
}

// Render customizado
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Factories para datos de prueba
export const createMockApp = (overrides = {}) => ({
  id: '1',
  name: 'Test App',
  description: 'Test description',
  category: 'development',
  brewId: 'test-app',
  ...overrides
})

export const createMockProfile = (overrides = {}) => ({
  id: 'test-profile',
  apps: [createMockApp()],
  createdAt: new Date().toISOString(),
  version: '2.0',
  ...overrides
})

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
```

### Mock Factories

```typescript
// mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  // Mock Homebrew API
  rest.get('https://formulae.brew.sh/api/formula.json', (req, res, ctx) => {
    const query = req.url.searchParams.get('q')
    
    const mockFormulas = [
      { name: 'git', desc: 'Distributed version control system' },
      { name: 'node', desc: 'Platform for JavaScript runtime' },
      { name: 'python', desc: 'Programming language' }
    ]

    const filtered = query 
      ? mockFormulas.filter(f => f.name.includes(query) || f.desc.includes(query))
      : mockFormulas

    return res(ctx.json(filtered))
  }),

  // Mock error scenarios
  rest.get('*/error', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: 'Server error' }))
  })
]
```

## 📊 CI/CD Testing Pipeline

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linting
      run: npm run lint

    - name: Run type checking
      run: npm run type-check

    - name: Run unit tests
      run: npm test -- --coverage --watchAll=false

    - name: Run integration tests
      run: npm run test:integration

    - name: Run E2E tests
      run: |
        npm run build
        npm run preview &
        npx wait-on http://localhost:4173
        npm run test:e2e

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
```

## 📈 Métricas y Reportes

### Coverage Reports

```json
// package.json
{
  "scripts": {
    "test:coverage": "jest --coverage",
    "test:coverage:watch": "jest --coverage --watchAll",
    "test:coverage:html": "jest --coverage && open coverage/lcov-report/index.html"
  },
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/test-utils.tsx",
      "!src/**/*.stories.tsx"
    ],
    "coverageReporters": ["text", "lcov", "html"],
    "coverageThreshold": {
      "global": {
        "branches": 90,
        "functions": 90,
        "lines": 90,
        "statements": 90
      }
    }
  }
}
```

### Test Reporting

```typescript
// jest.config.js
module.exports = {
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './test-results',
      outputName: 'junit.xml'
    }],
    ['jest-html-reporters', {
      publicPath: './test-results',
      filename: 'report.html'
    }]
  ]
}
```

## 🎯 Best Practices

### 1. **Naming Conventions**
```typescript
// ✅ Descriptive test names
describe('ScriptGenerator', () => {
  describe('when generating script with multiple apps', () => {
    it('should include all app install commands', () => {})
    it('should add proper error handling', () => {})
  })
})

// ❌ Vague test names
describe('ScriptGenerator', () => {
  it('works', () => {})
  it('test2', () => {})
})
```

### 2. **Test Organization**
```typescript
// ✅ Organize by feature/behavior
describe('AppCard component', () => {
  describe('rendering', () => {
    it('displays app name')
    it('displays app description')
  })
  
  describe('interaction', () => {
    it('calls onToggle when clicked')
    it('supports keyboard navigation')
  })
  
  describe('accessibility', () => {
    it('has proper ARIA labels')
    it('supports screen readers')
  })
})
```

### 3. **Test Data Management**
```typescript
// ✅ Use factories for consistent test data
const mockApp = createMockApp({ name: 'Chrome' })

// ✅ One assertion per test
it('should toggle app selection', () => {
  const { result } = renderHook(() => useAppSelection())
  
  act(() => result.current.toggleApp(mockApp))
  
  expect(result.current.isSelected(mockApp)).toBe(true)
})

// ❌ Multiple unrelated assertions
it('should do many things', () => {
  expect(component.name).toBe('Chrome')
  expect(component.isSelected).toBe(false)
  expect(otherThing.value).toBe(42)
})
```

---

## 🎓 Recursos Adicionales

- **[Jest Documentation](https://jestjs.io/docs/getting-started)** - Framework de testing
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro)** - Testing de componentes React  
- **[MSW Documentation](https://mswjs.io/docs/)** - Mock Service Worker
- **[Playwright Documentation](https://playwright.dev/)** - E2E testing

**¡Los tests son nuestra red de seguridad que nos permite innovar con confianza! 🧪✅**
