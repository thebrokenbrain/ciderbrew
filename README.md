# 🍏 Ciderbrew

**Tu asistente inteligente para configurar macOS con Homebrew**

Ciderbrew es una aplicación web moderna que te permite seleccionar aplicaciones, generar scripts de instalación automatizados y configurar tu Mac de manera rápida y eficiente usando Homebrew.

![Ciderbrew Screenshot](docs/images/ciderbrew-preview.png)

## ✨ Características Principales

- 🔍 **Búsqueda Inteligente**: Encuentra aplicaciones por nombre, categoría o descripción
- 📦 **Catálogo Extenso**: Más de 500+ aplicaciones preconfiguradas + acceso a toda la API de Homebrew
- 🎯 **Generación de Scripts**: Crea scripts bash optimizados para instalación automatizada
- 👤 **Gestión de Perfiles**: Guarda y comparte configuraciones personalizadas
- 🌙 **Modo Oscuro**: Interfaz adaptable con temas claro, oscuro y automático
- 🏗️ **Detección de Arquitectura**: Soporte completo para Apple Silicon (M1/M2/M3) e Intel
- 📱 **Diseño Responsivo**: Funciona perfectamente en desktop, tablet y móvil
- ⚡ **Búsqueda Híbrida**: Combinación de resultados locales y API de Homebrew en tiempo real

## 🚀 Demo en Vivo

👉 **[Prueba Ciderbrew aquí](https://ciderbrew.app)** 

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Testing**: Jest + React Testing Library
- **API**: Homebrew Formulae API
- **Storage**: LocalStorage + JSON Import/Export

## 📦 Instalación y Desarrollo

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/thebrokenbrain/macos-setup-assistant.git
cd macos-setup-assistant

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run lint         # Linting con ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 🎯 Cómo Usar Ciderbrew

### 1. Selección de Aplicaciones
- Navega por categorías (Desarrollo, Navegadores, Productividad, etc.)
- Usa la búsqueda inteligente para encontrar aplicaciones específicas
- Haz clic en las tarjetas para seleccionar/deseleccionar aplicaciones

### 2. Generación de Scripts
- Las aplicaciones seleccionadas aparecen automáticamente en el generador
- Configura opciones avanzadas (actualizaciones, cleanup, verbose)
- Haz clic en "Generar Script" para crear el script bash

### 3. Gestión de Perfiles
- Guarda configuraciones con "Perfiles"
- Exporta/importa configuraciones como archivos JSON
- Comparte perfiles con otros usuarios

### 4. Ejecución del Script
```bash
# Hacer el script ejecutable
chmod +x install-apps.sh

# Ejecutar instalación
./install-apps.sh
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── AppCard.tsx     # Tarjeta de aplicación
│   ├── Header.tsx      # Cabecera principal
│   ├── SearchInterface.tsx  # Interfaz de búsqueda
│   └── ...
├── services/           # Servicios y lógica de negocio
│   ├── ScriptGenerator.ts   # Generación de scripts
│   ├── HybridSearchService.ts # Búsqueda híbrida
│   └── StorageService.ts    # Persistencia local
├── hooks/              # React Hooks personalizados
│   ├── useAppSelection.ts   # Gestión de selección
│   └── useTheme.ts         # Gestión de temas
├── data/               # Datos estáticos
│   └── apps.ts         # Catálogo de aplicaciones
├── types/              # Definiciones TypeScript
└── utils/              # Utilidades y helpers
```

## 🧪 Testing

Ciderbrew cuenta con una suite de tests completa:

- **Tests Unitarios**: Componentes y servicios individuales
- **Tests de Integración**: Flujos completos de usuario  
- **Tests de Regresión**: Prevención de bugs conocidos
- **Coverage**: 95%+ de cobertura de código

```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor revisa nuestra [Guía de Contribución](./docs/CONTRIBUTING.md).

### Proceso de Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📚 Documentación

- **[📖 Documentación Completa](./docs/README.md)** - Guía detallada del proyecto
- **[🏗️ Arquitectura](./docs/architecture/README.md)** - Diseño y patrones
- **[🧪 Testing](./docs/testing/README.md)** - Estrategia de pruebas
- **[🚀 Deployment](./docs/deployment/README.md)** - Guía de despliegue
- **[🔧 API Reference](./docs/api/README.md)** - Documentación de APIs

## 🐛 Reportar Bugs

¿Encontraste un bug? Por favor [crea un issue](https://github.com/thebrokenbrain/macos-setup-assistant/issues) con:

- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si es relevante
- Información del sistema (macOS version, browser, etc.)

## 🗺️ Roadmap

### v2.1 (Próximo)
- [ ] PWA support para uso offline
- [ ] Sincronización en la nube
- [ ] Integración con GitHub Dotfiles
- [ ] Comandos de configuración post-instalación

### v2.2 (Futuro)
- [ ] Marketplace de perfiles comunitarios
- [ ] CLI companion tool
- [ ] Soporte para Linux y Windows
- [ ] Integración con Docker

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- **Homebrew** - Por hacer que la instalación de software en macOS sea simple
- **React Team** - Por la increíble librería
- **Tailwind CSS** - Por el framework de styling
- **La Comunidad Open Source** - Por las infinitas inspiración y herramientas

## 💖 Apoyo

Si Ciderbrew te resulta útil, considera:

- ⭐ Dar una estrella al repositorio
- 🐛 Reportar bugs o solicitar features
- 💝 [Invitarme un café](https://buymeacoffee.com/thebrokenbrain)
- 📢 Compartir el proyecto

---

**Hecho con ❤️ y mucho café por [thebrokenbrain](https://github.com/thebrokenbrain)**

*Ciderbrew - Instala macOS a tu manera* 🍏
