# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# 🍎 macOS Setup Assistant

Una aplicación web moderna e intuitiva construida con **React**, **TypeScript** y **Tailwind CSS** para generar scripts personalizados de instalación de aplicaciones en macOS.

## 🌟 Demo en Vivo

**🔗 [Ver Aplicación Online](https://josemi.github.io/macos_setup_2/)**

![macOS Setup Assistant](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)

## ✨ Características Principales

- 🎯 **Interfaz Moderna**: Diseño intuitivo y responsivo con animaciones fluidas
- 📱 **Mobile-First**: Funciona perfectamente en móvil, tablet y desktop
- 🔧 **29+ Aplicaciones**: Amplio catálogo organizado en 5 categorías
- ⚡ **Generación Instantánea**: Scripts bash optimizados en tiempo real
- 📥 **Descarga Directa**: Archivo `.sh` listo para ejecutar
- 📋 **Copia Rápida**: Un clic para copiar al portapapeles
- 🏷️ **Contador Inteligente**: Seguimiento visual de selecciones en tiempo real
- 🎨 **TypeScript**: Código completamente tipado y robusto

## 🚀 Cómo Usar

1. **🌐 [Abre la aplicación online](https://thebrokenbrain.github.io/macos-setup-assistant/)**
2. **📱 Navega** por las pestañas de categorías
3. **✅ Selecciona** las aplicaciones que deseas instalar
4. **🎯 Genera** el script con el botón "Generar Script"
5. **📥 Descarga** o **📋 copia** el script generado
6. **💻 Ejecuta** en Terminal: `chmod +x macos-setup.sh && ./macos-setup.sh`

## 🎯 Categorías de Aplicaciones

### ## � Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript  
- **Tailwind CSS** - Framework de CSS utilitario
- **Vite** - Build tool ultrarrápido
- **Font Awesome** - Iconografía moderna
- **GitHub Pages** - Hosting automático con GitHub Actions

## 📈 Características

- ✅ **29+ aplicaciones** organizadas en 5 categorías
- 🎯 **Contadores dinámicos** de selección por categoría
- � **Diseño responsivo** para móviles y desktop
- ⚡ **Generación rápida** de scripts bash optimizados
- 📥 **Descarga directa** o copia al portapapeles
- 🔄 **Selección masiva** por categoría
- 🎨 **Interfaz moderna** con efectos glassmorphism
- 📊 **Estadísticas visuales** de progreso

## ✨ Características

- **🎨 Interfaz Moderna**: Diseño responsivo con Tailwind CSS y animaciones fluidas
- **🔧 TypeScript**: Código completamente tipado para mayor robustez
- **📱 Responsivo**: Funciona perfectamente en desktop, tablet y móvil
- **🎯 Arquitectura Modular**: Fácil de extender y mantener
- **⚡ Rendimiento**: Optimizado con Vite y React 18
- **🎭 Componentes Reutilizables**: Arquitectura basada en componentes

### Funcionalidades

- **Selección intuitiva** de aplicaciones por categorías
- **Vista previa en tiempo real** del script generado
- **Descarga directa** del archivo `.sh`
- **Copia al portapapeles** con un clic
- **Sistema de notificaciones** (toasts) elegante
- **Gestión de estado** con hooks personalizados

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── Header.tsx
│   ├── TabNavigation.tsx
│   ├── AppGrid.tsx
│   ├── ScriptSection.tsx
│   └── ToastContainer.tsx
├── hooks/              # Custom hooks
│   └── useAppSelection.ts
├── services/           # Lógica de negocio
│   └── ScriptGenerator.ts
├── data/              # Configuración de aplicaciones
│   └── apps.ts
├── types/             # Definiciones de TypeScript
│   └── index.ts
├── App.tsx            # Componente principal
├── main.tsx           # Punto de entrada
└── index.css          # Estilos globales con Tailwind
```

## 🛠️ Desarrollo

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🎨 Personalización

### Añadir Nueva Aplicación

1. Edita `src/data/apps.ts`:

```typescript
{
  id: 'nueva-app',
  name: 'Nueva Aplicación',
  description: 'Descripción de la app',
  icon: 'fa-icon-name',
  category: 'desarrollo', // o la categoría apropiada
  installType: 'brew-cask',
  command: 'nueva-app'
}
```

### Añadir Nueva Categoría

1. Actualiza el tipo `AppCategory` en `src/types/index.ts`
2. Añade la nueva categoría en `src/data/apps.ts`
3. Los componentes se actualizarán automáticamente

## 📱 Aplicaciones Incluidas

### 🔧 Desarrollo (8 apps)
- Visual Studio Code, Git, Node.js, Docker, iTerm2, Postman, GitHub Desktop, Insomnia

### 💼 Productividad (7 apps)  
- Chrome, Firefox, Notion, Slack, Zoom, Obsidian, Raycast

### 🎵 Multimedia (5 apps)
- VLC, Spotify, HandBrake, Audacity, OBS Studio

### 🛠️ Utilidades (5 apps)
- The Unarchiver, AppCleaner, Rectangle, coconutBattery, CleanMyMac X

### ⚙️ Configuración (4 apps)
- Homebrew, Oh My Zsh, Xcode Command Line Tools, Mac App Store CLI

## 🚀 Cómo Usar

1. **Navega** por las pestañas de categorías
2. **Selecciona** las aplicaciones que deseas instalar
3. **Genera** el script con el botón "Generar Script"
4. **Descarga** o **copia** el script generado
5. **Ejecuta** en Terminal: `chmod +x macos-setup.sh && ./macos-setup.sh`

---

**¡Desarrollado con ❤️ y ⚡ por la comunidad!**

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
