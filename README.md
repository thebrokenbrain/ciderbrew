# 🍎 macOS Setup Assistant

Una aplicación web moderna construida con **React 19**, **TypeScript** y **Tailwind CSS** que genera scripts personalizados de instalación para macOS con búsqueda híbrida avanzada y detección automática de arquitectura.

![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-52%20passing-green?logo=jest)
![Architecture](https://img.shields.io/badge/Architecture-ARM64%20%7C%20Intel-blue?logo=apple)

## 🌟 Demo en Vivo

**🔗 [Ver Aplicación Online](https://thebrokenbrain.github.io/macos-setup-assistant/)**

## ✨ Características Principales

### 🔍 **Búsqueda Híbrida Avanzada**
- **Búsqueda local instantánea** en 30+ aplicaciones populares curadas
- **Integración con Homebrew API** para acceso a 6000+ paquetes
- **Fallback inteligente** con sistema de caché optimizado
- **Debouncing y paginación** para mejor rendimiento

### 🏗️ **Detección Automática de Arquitectura**
- **Compatibilidad ARM64/Intel** mostrada visualmente con badges
- **Base de datos de 60+ aplicaciones** con soporte conocido
- **Heurísticas inteligentes** para apps desconocidas
- **Detección automática** para herramientas CLI y GUI

### 🎨 **Diseño Personalizado y Responsivo**
- **Tema marrón/ámbar personalizado** con iconografía propia
- **Icono y favicon personalizados** para branding único
- **Completamente responsivo** - optimizado para móviles y tablets
- **Navegación suave** con scroll automático a secciones

### ⚡ **Generación Inteligente de Scripts**
- **Scripts bash optimizados** con manejo de errores
- **Opciones configurables** (actualizaciones, cleanup, verboso)
- **Descarga directa** o copia al portapapeles
- **Validación de dependencias** y orden de instalación

## 🚀 ¿Cómo funciona?

1. **🔍 Busca** aplicaciones usando la barra de búsqueda híbrida
2. **📱 Selecciona** las apps que necesitas con badges de arquitectura
3. **⚙️ Configura** opciones de instalación (actualizaciones, verboso, etc.)
4. **📄 Genera** tu script personalizado con un clic
5. **💾 Descarga** o copia el script y ejecútalo en Terminal

### Ejemplo de uso:
```bash
# Buscar "chrome" muestra instantáneamente Google Chrome (local)
# Buscar "mongodb" consulta Homebrew API automáticamente
# Seleccionar apps muestra badges ARM64/Intel
# Generar script incluye todas las dependencias en orden correcto
```

## 🏗️ Arquitectura Técnica

### � **Stack Tecnológico**
- **React 19.1** - UI library con Concurrent Features
- **TypeScript 5.0** - Tipado estático end-to-end
- **Vite 7.1** - Build tool ultrarrápido con HMR
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Jest 30.1** - Testing framework con React Testing Library

### �️ **Estructura del Proyecto**

```
src/
├── components/                 # Componentes React modernos
│   ├── Header.tsx             # Cabecera con icono personalizado
│   ├── SearchInterface.tsx    # Interfaz de búsqueda híbrida
│   ├── AppCard.tsx           # Cards con badges de arquitectura
│   ├── ScriptSection.tsx     # Generación y descarga de scripts
│   └── ToastContainer.tsx    # Sistema de notificaciones
├── services/                  # Capa de servicios especializados
│   ├── HybridSearchService.ts       # Búsqueda local + API
│   ├── ArchitectureDetectionService.ts # Detección ARM64/Intel
│   ├── LocalSearchService.ts        # Búsqueda local optimizada
│   ├── BrewApiService.ts            # Cliente Homebrew API
│   └── ScriptGenerator.ts           # Generación de scripts
├── hooks/                     # Custom hooks optimizados
│   ├── useAppSelection.ts     # Gestión estado de selección
│   └── useDebounce.ts        # Debouncing para búsqueda
├── types/                     # Sistema de tipos unificado
│   └── api.ts                # Tipos SearchableApp y más
└── __tests__/                # Suite de tests completa (52 tests)
    ├── components/           # Tests de componentes
    └── services/            # Tests de servicios y lógica
```

### 🔧 **Servicios Clave**

#### `HybridSearchService`
Sistema de búsqueda inteligente que:
- Busca primero en cache local (instantáneo)
- Fallback a Homebrew API si no hay suficientes resultados
- Enriquece resultados con información de arquitectura
- Maneja errores gracefully con indicadores visuales

#### `ArchitectureDetectionService`
Detecta compatibilidad de arquitectura:
- Base de datos curada de 60+ aplicaciones populares
- Heurísticas para CLI tools (universal por defecto)
- Detección de apps legacy/especializadas (Intel only)
- Badges visuales ARM64/Intel en la interfaz

#### `ScriptGenerator`
Genera scripts bash optimizados:
- Agrupación inteligente de comandos brew/cask
- Opciones configurables (updates, cleanup, verbose)
- Manejo de errores y validaciones
- Descarga directa y copia al portapapeles

## �️ Desarrollo Local

### Prerrequisitos
```bash
# Node.js 18+
node --version  # >= 18.0.0

# npm o yarn
npm --version
```

### Instalación y Ejecución
```bash
# Clonar repositorio
git clone https://github.com/thebrokenbrain/macos-setup-assistant.git
cd macos-setup-assistant

# Instalar dependencias
npm install

# Desarrollo con hot reload
npm run dev
# → http://localhost:5173

# Build para producción
npm run build

# Preview del build
npm run preview
```

### Scripts Disponibles
- `npm run dev` - Servidor desarrollo con HMR
- `npm run build` - Build optimizado para producción  
- `npm run preview` - Preview del build
- `npm run lint` - Análisis de código ESLint
- `npm test` - Ejecutar suite de tests

## 🧪 Testing

### Estado Actual
- ✅ **52 tests pasando** en 7 test suites
- ✅ **Cobertura completa** de servicios críticos
- ✅ **Tests de integración** para búsqueda híbrida
- ✅ **Tests de arquitectura** para detección ARM64/Intel
- ✅ **CI/CD** con GitHub Actions

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Tests con coverage report
npm run test:coverage
```

### Suites de Test Incluidas
- **HybridSearchService**: Búsqueda local + API + fallbacks
- **ArchitectureDetectionService**: Detección ARM64/Intel  
- **ScriptGenerator**: Generación y opciones de scripts
- **Components**: Header, AppCard con arquitectura
- **Integration**: Tests end-to-end de flujos completos

## 🎨 Personalización

### Añadir Nueva Aplicación Local
Edita `src/services/LocalSearchService.ts`:

```typescript
{
  id: 'mi-app',
  name: 'Mi Aplicación',
  description: 'Descripción detallada',
  homepage: 'https://mi-app.com',
  version: 'latest',
  installType: 'brew-cask',
  command: 'brew install --cask mi-app',
  category: 'Development',
  source: 'predefined'
}
```

### Configurar Detección de Arquitectura
Actualiza `src/services/ArchitectureDetectionService.ts`:

```typescript
// Para apps con soporte conocido
private static readonly KNOWN_ARCHITECTURE_SUPPORT = {
  'mi-app': { arm64: true, intel: true },
  'app-legacy': { arm64: false, intel: true }
};
```

### Personalizar Tema Visual
Los colores se configuran en `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#f4f1e8',   // Marrón muy claro
    // ... escala completa
    900: '#2c190a'   // Marrón muy oscuro
  }
}
```

## 🚀 Despliegue

### GitHub Pages (Automático)
La aplicación se despliega automáticamente a GitHub Pages:

1. **Push a main** → Tests automáticos en CI
2. **Tests pasan** → Build de producción  
3. **Deploy automático** → Disponible en GitHub Pages

**URL de producción:** https://thebrokenbrain.github.io/macos-setup-assistant/

### Despliegue Manual
```bash
# Build para producción
npm run build

# Los archivos estarán en dist/
# Sube dist/ a tu hosting preferido
```

## 🤝 Contribuir

### Proceso de Contribución
1. Fork del repositorio
2. Crear feature branch: `git checkout -b feature/nueva-funcionalidad`
3. Hacer cambios con tests incluidos
4. Verificar que pasen todos los tests: `npm test`
5. Commit: `git commit -m 'feat: añadir nueva funcionalidad'`
6. Push: `git push origin feature/nueva-funcionalidad`
7. Crear Pull Request

### Estándares de Código
- **TypeScript estricto** - Sin `any`, tipos explícitos
- **Tests obligatorios** - Para nueva funcionalidad
- **ESLint + Prettier** - Formato consistente
- **Conventional Commits** - Para changelog automático

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] **Perfiles de instalación** - Guardar configuraciones
- [ ] **Sincronización en la nube** - Backup de selecciones
- [ ] **Scripts de desinstalación** - Reverting changes
- [ ] **Detección de apps instaladas** - Estado actual del sistema
- [ ] **Temas personalizables** - Dark mode y más colores

### Mejoras Técnicas
- [ ] **Service Workers** - Funcionalidad offline
- [ ] **PWA completa** - Instalación en dispositivos
- [ ] **WebAssembly** - Parser de dependencies más rápido
- [ ] **Streaming** - Instalación en tiempo real

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para detalles completos.

## 🙏 Agradecimientos

- **[Homebrew](https://brew.sh)** - El mejor package manager para macOS
- **[Homebrew API](https://formulae.brew.sh/api/)** - Datos actualizados de paquetes
- **React Team** - Por la increíble biblioteca UI
- **Tailwind CSS** - Framework CSS que hace el diseño un placer
- **Vite Team** - Build tool que revolucionó el desarrollo

---

<div align="center">
  <p><strong>Hecho con ❤️ para simplificar la configuración de macOS</strong></p>
  <p>
    <a href="https://github.com/thebrokenbrain/macos-setup-assistant">⭐ Dale una estrella</a> si este proyecto te resulta útil
  </p>
  <p>
    <a href="https://github.com/thebrokenbrain/macos-setup-assistant/issues">🐛 Reportar bug</a> · 
    <a href="https://github.com/thebrokenbrain/macos-setup-assistant/issues">💡 Solicitar feature</a> ·
    <a href="https://github.com/thebrokenbrain/macos-setup-assistant/discussions">💬 Discusiones</a>
  </p>
</div>
