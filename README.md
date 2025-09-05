# 🍎 macOS Setup Assistant

Una aplicación web moderna construida con **React 19**, **TypeScript** y **Tailwind CSS** para generar scripts personalizados de instalación de aplicaciones en macOS.

![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-46%20passing-green?logo=jest)

## 🌟 Demo en Vivo

**🔗 [Ver Aplicación Online](https://thebrokenbrain.github.io/macos-setup-assistant/)**

## ✨ ¿Qué hace la aplicación?

macOS Setup Assistant es una herramienta web que simplifica la configuración inicial de un Mac nuevo. Te permite:

- **📱 Seleccionar visualmente** las aplicaciones que necesitas de un catálogo de 29+ apps
- **🎯 Generar automáticamente** un script bash optimizado y personalizado
- **📥 Descargar o copiar** el script para ejecutarlo en Terminal
- **⚡ Automatizar** la instalación de todas tus aplicaciones favoritas con un solo comando

### Flujo de uso:
1. Navega por las **5 categorías** de aplicaciones (Desarrollo, Productividad, Multimedia, Utilidades, Configuración)
2. **Selecciona** las aplicaciones que deseas instalar
3. Haz clic en **"Generar Script"** 
4. **Descarga** el archivo `macos-setup.sh` generado
5. **Ejecuta** en Terminal: `chmod +x macos-setup.sh && ./macos-setup.sh`

## 🏗️ Arquitectura de la Aplicación

### 📋 Stack Tecnológico
- **React 19.1** - Biblioteca de interfaz de usuario con Concurrent Features
- **TypeScript 5.0** - Tipado estático para JavaScript
- **Vite 7.1** - Build tool moderno y ultrarrápido
- **Tailwind CSS 3.4** - Framework de CSS utilitario
- **Jest 30.1** - Framework de testing con React Testing Library
- **Font Awesome** - Iconografía completa

### 📁 Estructura del Proyecto

```
src/
├── components/              # Componentes React reutilizables
│   ├── Header.tsx          # Cabecera con contador de apps
│   ├── TabNavigation.tsx   # Navegación de categorías + botones de acción
│   ├── AppGrid.tsx         # Grid de aplicaciones seleccionables
│   ├── ScriptSection.tsx   # Generación y preview del script
│   └── ToastContainer.tsx  # Sistema de notificaciones
├── hooks/                  # Custom hooks
│   └── useAppSelection.ts  # Gestión completa del estado de selección
├── services/               # Lógica de negocio
│   └── ScriptGenerator.ts  # Generación de scripts bash
├── data/                   # Configuración y datos
│   └── apps.ts            # Catálogo de aplicaciones y categorías
├── types/                  # Definiciones TypeScript
│   └── index.ts           # Tipos de la aplicación
├── __tests__/             # Tests unitarios
│   ├── hooks/             # Tests de hooks
│   ├── services/          # Tests de servicios
│   └── components/        # Tests de componentes
├── App.tsx                # Componente principal con routing condicional
├── main.tsx               # Punto de entrada de React
└── index.css              # Configuración de Tailwind CSS
```

### 🔧 Arquitectura de Componentes

#### `useAppSelection` Hook
Gestiona todo el estado de la aplicación:
- Selección/deselección de aplicaciones
- Filtrado por categorías
- Sistema de toasts/notificaciones
- Control de visualización del generador de scripts

#### `ScriptGenerator` Service
Clase estática que maneja:
- Generación de scripts bash optimizados
- Instalación de Homebrew
- Agrupación inteligente de comandos
- Descarga de archivos y copia al portapapeles

#### Componentes Modulares
- **Header**: Feedback visual del estado de selección
- **TabNavigation**: Navegación + acciones principales
- **AppGrid**: Visualización interactiva de aplicaciones
- **ScriptSection**: Generación automática y preview del script

## 🚀 Cómo compilar

### Prerrequisitos
```bash
# Node.js 18 o superior
node --version  # Debe ser >= 18.0.0

# npm o yarn
npm --version
```

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/thebrokenbrain/macos-setup-assistant.git
cd macos-setup-assistant

# Instalar dependencias
npm install

# Compilar para producción
npm run build

# El resultado estará en la carpeta 'dist/'
```

## 🖥️ Cómo levantar la aplicación en local

```bash
# Modo desarrollo (con hot reload)
npm run dev

# La aplicación estará disponible en:
# http://localhost:5173/macos-setup-assistant/

# Preview del build de producción
npm run build && npm run preview
```

### Scripts disponibles:
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build optimizado para producción
- `npm run preview` - Preview del build de producción
- `npm run lint` - Análisis de código con ESLint

## 🧪 Cómo ejecutar los tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests para CI (usado en GitHub Actions)
npm run test:ci
```

### Estado actual de tests:
- ✅ **46 tests pasando**
- ✅ **5 test suites** (hooks, services, components)
- ✅ **53% cobertura** de código
- ✅ **Integración continua** con GitHub Actions

### Tests incluidos:
- **useAppSelection Hook**: 12 tests de gestión de estado
- **ScriptGenerator Service**: 22 tests de generación de scripts
- **Header Component**: 6 tests de renderizado y lógica
- **Hooks básicos**: 4 tests adicionales

## 📦 Gestión de Aplicaciones y Configuraciones

### ➕ Añadir una nueva aplicación

Edita el archivo `src/data/apps.ts` y añade un nuevo objeto al array `apps`:

```typescript
{
  id: 'mi-nueva-app',                    // ID único
  name: 'Mi Nueva Aplicación',           // Nombre visible
  description: 'Descripción detallada',  // Descripción que se muestra
  icon: 'fa-rocket',                     // Icono de Font Awesome
  category: 'desarrollo',                // Categoría existente
  installType: 'brew-cask',             // Tipo de instalación
  command: 'mi-nueva-app',               // Comando para Homebrew
  isRequired: false                      // Si es obligatoria o no
}
```

#### Tipos de instalación disponibles:
- `'brew'` - Paquetes de línea de comandos: `brew install comando`
- `'brew-cask'` - Aplicaciones GUI: `brew install --cask comando`
- `'mas'` - Mac App Store: `mas install app-id`
- `'curl-script'` - Scripts descargables: `curl -s url | sh`
- `'xcode-select'` - Herramientas de Xcode: `xcode-select --install`

### ➕ Añadir una nueva categoría

1. **Actualiza los tipos** en `src/types/index.ts`:
```typescript
export type AppCategory = 
  | 'desarrollo' 
  | 'productividad' 
  | 'multimedia' 
  | 'utilidades' 
  | 'configuracion'
  | 'mi-nueva-categoria';  // ← Añadir aquí
```

2. **Añade la configuración** en `src/data/apps.ts`:
```typescript
export const appConfig = {
  categories: {
    // ... otras categorías
    'mi-nueva-categoria': {
      name: 'Mi Nueva Categoría',
      icon: 'fa-star',        // Icono de Font Awesome
      description: 'Descripción de la categoría'
    }
  }
  // ...
}
```

3. **Añade aplicaciones** con `category: 'mi-nueva-categoria'`

### ❌ Eliminar una aplicación

1. Busca la app en `src/data/apps.ts` por su `id`
2. Elimina el objeto completo del array
3. La aplicación desaparecerá automáticamente de la interfaz

### 🔧 Ejemplo práctico: Añadir Figma

```typescript
{
  id: 'figma',
  name: 'Figma',
  description: 'Herramienta de diseño colaborativo en la nube',
  icon: 'fa-pencil-ruler',
  category: 'productividad',
  installType: 'brew-cask',
  command: 'figma'
}
```

### 🎨 Personalizar estilos

Los estilos usan **Tailwind CSS**. Para personalizar:

1. **Colores principales** se definen en `tailwind.config.js`
2. **Estilos globales** en `src/index.css`
3. **Componentes** usan clases de Tailwind inline

## 🚀 Despliegue

La aplicación se despliega automáticamente en **GitHub Pages** mediante **GitHub Actions**:

1. **Push a main** → Se ejecutan los tests automáticamente
2. **Tests pasan** → Se construye la aplicación
3. **Build exitoso** → Se despliega a GitHub Pages

### URL de producción:
- 🌐 **https://thebrokenbrain.github.io/macos-setup-assistant/**

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una branch: `git checkout -b feature/nueva-caracteristica`
3. Commit tus cambios: `git commit -m 'Añadir nueva característica'`
4. Push a la branch: `git push origin feature/nueva-caracteristica`
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- **Homebrew** - Sistema de gestión de paquetes para macOS
- **Font Awesome** - Iconografía completa
- **Tailwind CSS** - Framework de CSS utilitario
- **React Team** - Por la increíble biblioteca de UI
- **Vite Team** - Por el build tool ultrarrápido

---

<div align="center">
  <p>Hecho con ❤️ para la comunidad macOS</p>
  <p>
    <a href="https://github.com/thebrokenbrain/macos-setup-assistant">⭐ Star este proyecto</a> si te resulta útil
  </p>
</div>
