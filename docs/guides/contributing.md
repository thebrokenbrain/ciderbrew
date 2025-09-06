# 🤝 Guía de Contribución

*Cómo contribuir al desarrollo de Ciderbrew*

## 🎯 Bienvenido Contributor!

¡Gracias por tu interés en contribuir a Ciderbrew! Este proyecto es open source y crece gracias a contribuciones como la tuya. Esta guía te ayudará a empezar, sin importar tu nivel de experiencia.

## 🌟 Tipos de Contribuciones

### Para todos los niveles:
- 📝 **Reportar bugs** - Encontraste algo que no funciona
- 💡 **Sugerir funcionalidades** - Ideas para mejorar la app
- 📚 **Mejorar documentación** - Hacer las guías más claras
- 🌍 **Traducciones** - Agregar soporte para otros idiomas

### Para desarrolladores:
- 🐛 **Arreglar bugs** - Resolver problemas reportados
- ⚡ **Optimizaciones** - Mejorar performance
- 🎨 **Mejoras de UI/UX** - Hacer la interfaz más intuitiva
- 🧪 **Agregar tests** - Mejorar cobertura de pruebas
- 🚀 **Nuevas funcionalidades** - Implementar features solicitadas

## 🚀 Primeros Pasos

### 1. Fork y Clone

```bash
# 1. Hacer fork del repositorio en GitHub
# (Botón "Fork" en la página del repo)

# 2. Clonar tu fork
git clone https://github.com/TU-USUARIO/macos-setup-assistant.git
cd macos-setup-assistant

# 3. Agregar upstream para sincronizar
git remote add upstream https://github.com/thebrokenbrain/macos-setup-assistant.git

# 4. Verificar remotes
git remote -v
# origin    https://github.com/TU-USUARIO/macos-setup-assistant.git (fetch)
# upstream  https://github.com/thebrokenbrain/macos-setup-assistant.git (fetch)
```

### 2. Configurar Entorno

```bash
# Instalar dependencias
npm install

# Verificar que todo funciona
npm test
npm run dev

# Abrir http://localhost:5173 y probar la app
```

### 3. Crear Rama para tu Feature

```bash
# Sincronizar con upstream
git fetch upstream
git checkout main
git merge upstream/main

# Crear rama descriptiva
git checkout -b feature/search-optimization
# o
git checkout -b fix/profile-export-bug
# o
git checkout -b docs/improve-installation-guide
```

## 📝 Reportar Bugs

### Antes de reportar, verifica:
- [ ] El bug no está ya reportado en [Issues](https://github.com/thebrokenbrain/macos-setup-assistant/issues)
- [ ] Has probado en la versión más reciente
- [ ] Has revisado la [Guía de Troubleshooting](./troubleshooting.md)

### Template para Bug Reports

```markdown
## 🐛 Descripción del Bug
Descripción clara y concisa del problema.

## 📋 Pasos para Reproducir
1. Ir a '...'
2. Hacer clic en '...'
3. Scroll hasta '...'
4. Ver error

## ✅ Comportamiento Esperado
Descripción de qué esperabas que pasara.

## ❌ Comportamiento Actual
Descripción de qué pasó realmente.

## 📱 Información del Sistema
- OS: [ej. macOS 14.1]
- Navegador: [ej. Chrome 118.0.5993.88]
- Homebrew: [ej. 4.1.23 o "no instalado"]

## 📸 Screenshots
Si aplica, agrega screenshots para explicar el problema.

## 🔍 Información Adicional
Cualquier contexto adicional sobre el problema.
```

## 💡 Sugerir Funcionalidades

### Template para Feature Requests

```markdown
## 🚀 Feature Request

### ¿Tu feature está relacionada con un problema?
Descripción clara del problema. Ej: "Me frustra que..."

### 💡 Solución Propuesta
Descripción clara de lo que quieres que pase.

### 🔄 Alternativas Consideradas
Descripción de soluciones alternativas que consideraste.

### 📋 Casos de Uso
- Como [tipo de usuario], quiero [goal] para [benefit]
- Ejemplo: Como desarrollador nuevo en Mac, quiero un preset de "Desarrollo Web" para no tener que buscar todas las herramientas individualmente

### 🎯 Prioridad
- [ ] Nice to have
- [ ] Important
- [ ] Critical

### 📈 Impacto Estimado
¿A cuántos usuarios beneficiaría esta feature?
```

## 🛠️ Contribuir Código

### Workflow de Desarrollo

```bash
# 1. Asegurarte de estar actualizado
git checkout main
git pull upstream main

# 2. Crear rama para tu cambio
git checkout -b feature/nueva-funcionalidad

# 3. Hacer cambios y commits pequeños
git add .
git commit -m "feat: agregar búsqueda por popularidad"

# 4. Correr tests frecuentemente
npm test
npm run lint
npm run type-check

# 5. Push cuando esté listo
git push origin feature/nueva-funcionalidad

# 6. Crear Pull Request en GitHub
```

### Estándares de Código

#### Commits Convencionales

Usamos el formato [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Tipos principales:
feat: nueva funcionalidad
fix: arregla un bug
docs: cambios en documentación
style: formateo, espacios (no afecta funcionalidad)
refactor: refactoring sin cambio de funcionalidad
test: agregar o arreglar tests
chore: tareas de mantenimiento

# Ejemplos:
git commit -m "feat: agregar búsqueda por categoría"
git commit -m "fix: corregir error en generación de scripts"
git commit -m "docs: actualizar guía de instalación"
git commit -m "test: agregar tests para HybridSearchService"
```

#### Formato de Código

```bash
# Formateo automático
npm run format

# Linting
npm run lint

# Verificación de tipos
npm run type-check

# Todo en uno
npm run pre-commit
```

#### Estructura de Archivos

```typescript
// Orden de imports
import React from 'react'                    // React first
import { useState, useEffect } from 'react'  // React hooks
import clsx from 'clsx'                      // External libraries
import { Button } from './Button'            // Internal components
import { useTheme } from '../hooks/useTheme' // Internal hooks
import { formatAppName } from '../utils'     // Internal utilities
import type { App } from '../types'          // Types last

// Orden de definiciones en componentes
function MyComponent({ prop1, prop2 }: Props) {
  // 1. Hooks en orden:
  const [state, setState] = useState()       // State hooks
  const theme = useTheme()                   // Custom hooks
  const ref = useRef()                       // Ref hooks
  
  // 2. Computed values
  const computedValue = useMemo(() => {}, [])
  
  // 3. Effects
  useEffect(() => {}, [])
  
  // 4. Event handlers
  const handleClick = useCallback(() => {}, [])
  
  // 5. Render helpers (if complex)
  const renderContent = () => {}
  
  // 6. Return
  return <div>...</div>
}
```

### Testing

```bash
# Ejecutar tests relacionados a tus cambios
npm test -- --watch

# Tests específicos
npm test ComponentName

# Coverage de tu código
npm test -- --coverage --watchAll=false
```

#### Escribir Buenos Tests

```typescript
// ✅ Test bien estructurado
describe('useAppSelection hook', () => {
  describe('when toggling an app', () => {
    it('should add app to selection if not selected', () => {
      // Arrange
      const { result } = renderHook(() => useAppSelection())
      const mockApp = createMockApp({ id: '1', name: 'Chrome' })
      
      // Act
      act(() => {
        result.current.toggleApp(mockApp)
      })
      
      // Assert
      expect(result.current.isSelected(mockApp)).toBe(true)
      expect(result.current.selectedApps).toContain(mockApp)
    })
  })
})

// ❌ Test mal estructurado
it('test toggle', () => {
  const hook = renderHook(() => useAppSelection())
  hook.result.current.toggleApp({ id: '1' })
  expect(hook.result.current.selectedApps.length).toBe(1)
})
```

## 📚 Contribuir a la Documentación

### Tipos de Documentación

1. **Código** - Comentarios y JSDoc
2. **README** - Información básica del proyecto
3. **Guías** - Como esta guía de contribución
4. **API Docs** - Documentación técnica
5. **Tutoriales** - Guías paso a paso

### Estilo de Documentación

```markdown
# 📝 Usa emojis para hacer más visual
## 🎯 Secciones claras con propósito
### Subsecciones cuando sea necesario

- ✅ Listas con checkboxes para tareas
- 📋 Listas simples para información
- 💡 Callouts para tips importantes

```bash
# Bloques de código con sintaxis apropiada
npm install
```

**Texto en negritas** para conceptos importantes
*Texto en cursiva* para enfasis menor
`código inline` para comandos o nombres de archivos
```

### JSDoc para TypeScript

```typescript
/**
 * Busca aplicaciones usando búsqueda híbrida
 * @param query - Término de búsqueda
 * @param options - Opciones de configuración
 * @returns Promise con resultados ordenados por relevancia
 * @example
 * ```typescript
 * const results = await HybridSearchService.search('editor', {
 *   maxResults: 10,
 *   categories: ['development']
 * })
 * ```
 */
async function search(
  query: string, 
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  // Implementation...
}
```

## 🎨 Contribuir al Diseño

### Principios de Diseño

1. **Simplicidad** - La interfaz debe ser intuitiva
2. **Consistencia** - Elementos similares se comportan igual
3. **Accesibilidad** - Usar para todos los usuarios
4. **Performance** - Interacciones fluidas y rápidas

### Sistema de Diseño

```typescript
// Colores primarios
const colors = {
  primary: '#10b981',      // Ciderbrew green
  secondary: '#6b7280',    // Gray
  success: '#059669',      // Green
  warning: '#d97706',      // Amber
  error: '#dc2626',        // Red
}

// Espaciado consistente
const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
}
```

### Componentes Reutilizables

```typescript
// Crear componentes reutilizables en lugar de duplicar código
export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'font-medium rounded-lg transition-colors',
        {
          'bg-primary text-white hover:bg-primary-dark': variant === 'primary',
          'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
        },
        {
          'px-3 py-2 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        }
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

## 🌍 Internacionalización (i18n)

### Agregar Nuevos Idiomas

```typescript
// src/locales/es.json
{
  "common": {
    "search": "Buscar",
    "install": "Instalar",
    "cancel": "Cancelar"
  },
  "header": {
    "title": "Ciderbrew",
    "subtitle": "Tu asistente de configuración de macOS"
  },
  "search": {
    "placeholder": "Buscar aplicaciones...",
    "noResults": "No se encontraron aplicaciones",
    "results": "{count} aplicaciones encontradas"
  }
}
```

### Usar Traducciones

```typescript
import { useTranslation } from 'react-i18next'

function SearchInterface() {
  const { t } = useTranslation()
  
  return (
    <input 
      placeholder={t('search.placeholder')}
      aria-label={t('search.ariaLabel')}
    />
  )
}
```

## 🔄 Pull Request Process

### Antes de Crear el PR

```bash
# Checklist pre-PR
- [ ] Todos los tests pasan
- [ ] No hay errores de lint
- [ ] No hay errores de TypeScript
- [ ] Documentación actualizada si es necesario
- [ ] Commits siguen convención
- [ ] Rama actualizada con main
```

### Template de Pull Request

```markdown
## 📋 Tipo de Cambio
- [ ] Bug fix (cambio que arregla un problema)
- [ ] Nueva funcionalidad (cambio que agrega funcionalidad)
- [ ] Breaking change (fix o feature que causa que funcionalidad existente no funcione como se esperaba)
- [ ] Actualización de documentación

## 📝 Descripción
Descripción clara de los cambios realizados.

## 🔗 Issue Relacionado
Fixes #(número del issue)

## 🧪 Cómo Probar
Instrucciones para que los reviewers puedan probar tus cambios:
1. Ir a '...'
2. Hacer clic en '...'
3. Scroll hasta '...'
4. Ver resultado

## 📱 Screenshots
Si aplica, agrega screenshots de los cambios visuales.

## ✅ Checklist
- [ ] Mi código sigue las convenciones del proyecto
- [ ] He hecho self-review de mi código
- [ ] He comentado mi código, especialmente en áreas difíciles de entender
- [ ] He hecho cambios correspondientes a la documentación
- [ ] Mis cambios no generan nuevas warnings
- [ ] He agregado tests que prueban que mi fix es efectivo o que mi feature funciona
- [ ] Tests nuevos y existentes pasan localmente con mis cambios
```

### Review Process

1. **Automated checks** - CI/CD ejecuta tests automáticamente
2. **Code review** - Al menos un maintainer revisa el código
3. **Testing** - Reviewers prueban los cambios manualmente
4. **Approval** - Cuando todo está bien, se aprueba el PR
5. **Merge** - Maintainer hace merge a main

## 👥 Comunidad y Comunicación

### Canales de Comunicación

1. **GitHub Issues** - Para bugs y feature requests
2. **GitHub Discussions** - Para preguntas y discusiones generales
3. **Pull Requests** - Para review de código
4. **README** - Para información general del proyecto

### Código de Conducta

#### Nuestros Valores

- **Respeto** - Tratamos a todos con respeto y dignidad
- **Inclusión** - Damos la bienvenida a contribuidores de todos los backgrounds
- **Colaboración** - Trabajamos juntos hacia objetivos comunes
- **Aprendizaje** - Ayudamos a otros a crecer y aprender

#### Comportamiento Esperado

- **Ser constructivo** en feedback y críticas
- **Ser paciente** con nuevos contribuidores
- **Ser abierto** a diferentes perspectivas y ideas
- **Ser profesional** en todas las interacciones

#### Comportamiento No Aceptable

- Lenguaje ofensivo, discriminatorio o acosador
- Ataques personales o políticos
- Spam o self-promotion excesiva
- Compartir información privada sin permiso

## 🏆 Reconocimiento de Contribuidores

### Tipos de Reconocimiento

1. **Contributors List** - Tu nombre en el README
2. **Release Notes** - Mención en las notas de release
3. **GitHub Activity** - Tu actividad visible en el repo
4. **Swag** - Para contribuidores regulares (cuando esté disponible)

### Cómo te Reconocemos

- **First-time contributors** - Bienvenida especial y ayuda extra
- **Regular contributors** - Acceso a beta features y roadmap discussions
- **Maintainers** - Acceso de write al repositorio

## 📈 Roadmap y Prioridades

### Próximas Versiones

#### v2.1 (Q2 2025)
- [ ] PWA support para uso offline
- [ ] Optimización de performance
- [ ] Mejoras de accesibilidad
- [ ] Internacionalización básica

#### v2.2 (Q3 2025)
- [ ] Sincronización en la nube
- [ ] Marketplace de perfiles comunitarios
- [ ] CLI companion tool
- [ ] Análisis de apps instaladas

### Áreas que Necesitan Ayuda

- 🧪 **Testing** - Aumentar cobertura, tests E2E
- 📚 **Documentación** - Guías para usuarios no técnicos
- 🌍 **i18n** - Traducciones a otros idiomas
- 🎨 **Design** - Mejoras de UX, iconografía
- ⚡ **Performance** - Optimizaciones, lazy loading
- ♿ **Accesibilidad** - ARIA labels, keyboard navigation

## 🎓 Recursos para Aprender

### Para Nuevos Contribuidores

- **[First Contributions](https://firstcontributions.github.io/)** - Tutorial para primer PR
- **[How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)** - Guía completa
- **[Git Handbook](https://guides.github.com/introduction/git-handbook/)** - Fundamentos de Git

### Para Desarrollo

- **[React Docs](https://react.dev/)** - Documentación oficial de React
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Guía de TypeScript
- **[Vite Guide](https://vitejs.dev/guide/)** - Documentación de Vite
- **[Testing Library](https://testing-library.com/)** - Mejores prácticas de testing

### Para Diseño

- **[Tailwind CSS](https://tailwindcss.com/docs)** - Framework CSS que usamos
- **[Heroicons](https://heroicons.com/)** - Iconos que utilizamos
- **[Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)** - WCAG 2.1

---

## 🙏 Agradecimientos

Gracias por considerar contribuir a Ciderbrew! Cada contribución, sin importar qué tan pequeña, hace que el proyecto sea mejor para todos. 

Si tienes preguntas sobre cómo contribuir, no dudes en:

- Abrir un [Discussion](https://github.com/thebrokenbrain/macos-setup-assistant/discussions)
- Crear un [Issue](https://github.com/thebrokenbrain/macos-setup-assistant/issues) 
- Contactar a los maintainers

**¡Esperamos verte en la comunidad! 🍎✨**
