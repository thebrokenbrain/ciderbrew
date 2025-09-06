# ⚙️ Guía de Instalación y Configuración

*Todo lo que necesitas para ejecutar Ciderbrew localmente*

## 🎯 Requisitos del Sistema

### Obligatorios
- **macOS** 10.15+ (Catalina o posterior)
- **Node.js** 18.0 o superior
- **npm** 8.0+ o **yarn** 1.22+
- **Git** (para clonar el repositorio)

### Opcionales pero Recomendados
- **VS Code** con extensiones de React/TypeScript
- **Terminal** mejorado (iTerm2, Warp, etc.)
- **Homebrew** ya instalado en el sistema

## 🔍 Verificar Requisitos

Antes de empezar, verifica que tengas todo instalado:

```bash
# Verificar Node.js
node --version
# Debería mostrar: v18.x.x o superior

# Verificar npm
npm --version
# Debería mostrar: 8.x.x o superior

# Verificar Git
git --version
# Debería mostrar: git version 2.x.x
```

## 📦 Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
# Clonar desde GitHub
git clone https://github.com/thebrokenbrain/macos-setup-assistant.git

# Navegar al directorio
cd macos-setup-assistant

# Verificar que estás en la rama correcta
git branch
```

### 2. Instalar Dependencias

```bash
# Instalar todas las dependencias
npm install

# O si prefieres yarn
yarn install
```

**¿Qué se está instalando?**
- **React 19**: Framework de interfaz de usuario
- **TypeScript**: Tipado estático para JavaScript
- **Vite**: Herramienta de build ultrarrápida
- **Tailwind CSS**: Framework de CSS utilitario
- **Jest**: Framework de testing
- **ESLint**: Linter para calidad de código

### 3. Configurar Variables de Entorno

```bash
# Crear archivo de configuración local
cp .env.example .env.local

# Editar configuraciones (opcional)
nano .env.local
```

**Variables disponibles:**
```env
# Puerto del servidor de desarrollo (por defecto: 5173)
VITE_PORT=5173

# URL base para producción
VITE_BASE_URL=https://ciderbrew.app

# Habilitar modo debug
VITE_DEBUG=false

# API de Homebrew (ya configurada)
VITE_HOMEBREW_API=https://formulae.brew.sh/api
```

## 🚀 Ejecutar en Modo Desarrollo

### Iniciar el Servidor

```bash
# Iniciar servidor de desarrollo
npm run dev

# O con yarn
yarn dev
```

**¿Qué pasa cuando ejecutas esto?**
1. Vite compila el código TypeScript
2. Tailwind CSS procesa los estilos
3. Se abre automáticamente `http://localhost:5173`
4. Hot Module Replacement (HMR) se activa para cambios en tiempo real

### Verificar que Todo Funciona

Una vez que el servidor esté ejecutándose:

1. **Abre tu navegador** en `http://localhost:5173`
2. **Verifica que aparece** la interfaz de Ciderbrew
3. **Prueba la búsqueda** escribiendo "chrome"
4. **Selecciona algunas aplicaciones** y verifica que cambian de color
5. **Genera un script** y verifica que se descarga

## 🔧 Scripts de Desarrollo Disponibles

```bash
# Servidor de desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview

# Ejecutar todos los tests
npm run test

# Tests en modo watch (se ejecutan automáticamente)
npm run test:watch

# Linting del código
npm run lint

# Formatear código automáticamente
npm run format

# Verificación de tipos TypeScript
npm run type-check

# Analizar bundle size
npm run analyze
```

## 🧪 Configurar Testing

### Ejecutar Tests

```bash
# Ejecutar toda la suite de tests
npm test

# Tests con coverage report
npm run test:coverage

# Tests específicos
npm test -- AppCard.test.tsx

# Tests en modo debug
npm test -- --verbose
```

### Estructura de Tests

Los tests están organizados en:
```
src/__tests__/
├── components/          # Tests de componentes React
├── services/           # Tests de servicios y lógica
├── hooks/              # Tests de custom hooks
├── integration/        # Tests de integración
└── utils/              # Tests de utilidades
```

## 🎨 Configurar el Entorno de Desarrollo

### VS Code (Recomendado)

Instala estas extensiones:

```bash
# Extensiones esenciales
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension ms-vscode.vscode-eslint
```

**Configuración recomendada** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Terminal Setup

Para una mejor experiencia de desarrollo:

```bash
# Instalar Oh My Zsh (opcional)
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Aliases útiles para el proyecto
echo 'alias cider="npm run dev"' >> ~/.zshrc
echo 'alias cider-test="npm run test:watch"' >> ~/.zshrc
echo 'alias cider-build="npm run build"' >> ~/.zshrc

# Recargar configuración
source ~/.zshrc
```

## 🚨 Solución de Problemas Comunes

### Error: "Command not found: npm"

**Problema**: Node.js no está instalado
**Solución**:
```bash
# Instalar Node.js con Homebrew
brew install node

# O descargar desde nodejs.org
```

### Error: "Permission denied"

**Problema**: Permisos de npm
**Solución**:
```bash
# Configurar npm para usar directorio local
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

### Error: "Port 5173 is already in use"

**Problema**: El puerto está ocupado
**Solución**:
```bash
# Encontrar qué proceso usa el puerto
lsof -i :5173

# Terminar el proceso (reemplaza PID con el número real)
kill -9 PID

# O usar un puerto diferente
npm run dev -- --port 3000
```

### Error: "Module not found"

**Problema**: Dependencias desactualizadas
**Solución**:
```bash
# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Tests Fallando

**Problema**: Tests no pasan después de cambios
**Solución**:
```bash
# Actualizar snapshots
npm test -- -u

# Limpiar cache de Jest
npm test -- --clearCache

# Ejecutar tests específicos para debug
npm test -- --verbose ComponentName
```

## 🔄 Workflow de Desarrollo Recomendado

### 1. Antes de Empezar a Trabajar
```bash
# Asegurarte de estar en la rama principal
git checkout main

# Obtener últimos cambios
git pull origin main

# Crear rama para tu feature
git checkout -b feature/nueva-funcionalidad

# Verificar que todo funciona
npm test
npm run dev
```

### 2. Durante el Desarrollo
```bash
# Mantener tests ejecutándose
npm run test:watch

# En otra terminal, servidor de desarrollo
npm run dev

# Commitear cambios frecuentemente
git add .
git commit -m "feat: descripción del cambio"
```

### 3. Antes de Hacer Push
```bash
# Verificar que todo funciona
npm run lint
npm run type-check
npm test
npm run build

# Push de la rama
git push origin feature/nueva-funcionalidad
```

## 🐳 Desarrollo con Docker (Opcional)

Si prefieres usar Docker:

```bash
# Construir imagen
docker build -t ciderbrew .

# Ejecutar contenedor
docker run -p 5173:5173 -v $(pwd):/app ciderbrew
```

## 📊 Monitoreo de Performance

### Analizar Bundle Size

```bash
# Generar análisis de bundle
npm run build
npm run analyze

# Esto abrirá un reporte visual de qué ocupa espacio
```

### Perfilar Componentes React

1. Instala React Developer Tools en tu navegador
2. Ve a la pestaña "Profiler"
3. Graba una sesión mientras usas la aplicación
4. Analiza componentes que tardan más en renderizar

## 🔧 Configuración Avanzada

### Personalizar Vite

Edita `vite.config.ts` para:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,        // Cambiar puerto
    open: true,        // Abrir navegador automáticamente
    host: '0.0.0.0'    // Permitir acceso desde red local
  },
  build: {
    outDir: 'dist',    // Directorio de output
    sourcemap: true    // Generar source maps
  }
})
```

### Configurar ESLint Personalizado

Edita `.eslintrc.js`:
```javascript
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    // Tus reglas personalizadas
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn'
  }
}
```

---

## ✅ Checklist de Instalación Completa

- [ ] Node.js 18+ instalado
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor de desarrollo funcionando (`npm run dev`)
- [ ] Tests pasando (`npm test`)
- [ ] VS Code configurado con extensiones
- [ ] Variables de entorno configuradas
- [ ] Git configurado para contribuciones

¡Si llegaste hasta aquí, ya tienes Ciderbrew ejecutándose localmente! 🎉

**Próximos pasos**: [Entender la Arquitectura](../architecture/README.md) o [Hacer tu Primera Contribución](./contributing.md)
