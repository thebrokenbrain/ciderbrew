# 🔧 Guía de Solución de Problemas

*Soluciones a los problemas más comunes al usar Ciderbrew*

## 🎯 Problemas Frecuentes y Soluciones

### 🚫 Homebrew no está instalado

**Síntomas:**
- Mensaje: "command not found: brew"
- El script descargado no funciona
- Error al ejecutar comandos de instalación

**Causa:** Homebrew no está instalado en el sistema

**Solución:**
```bash
# 1. Instalar Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Agregar Homebrew al PATH (para Apple Silicon)
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 3. Verificar instalación
brew --version
```

**Para usuarios de Apple Silicon (M1/M2/M3):**
```bash
# El path es diferente en Apple Silicon
export PATH="/opt/homebrew/bin:$PATH"

# Agregar permanentemente al perfil
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
```

---

### 🔒 Permisos denegados

**Síntomas:**
- "Permission denied" al ejecutar script
- "You don't have permission to access"
- El script se descarga pero no ejecuta

**Causa:** El archivo de script no tiene permisos de ejecución

**Solución:**
```bash
# Hacer el script ejecutable
chmod +x install-apps.sh

# Verificar permisos
ls -la install-apps.sh
# Debería mostrar: -rwxr-xr-x

# Ejecutar el script
./install-apps.sh
```

**Alternativa:** Ejecutar con bash directamente
```bash
bash install-apps.sh
```

---

### 📱 Aplicaciones no aparecen en Spotlight

**Síntomas:**
- Las aplicaciones se instalan pero no aparecen en Spotlight
- No se encuentran en /Applications
- Cask instalado pero aplicación invisible

**Causa:** Aplicaciones cask instaladas en ubicación no indexada

**Solución:**
```bash
# Reindexar Spotlight
sudo mdutil -E /

# Verificar donde se instaló la aplicación
brew list --cask nombre-aplicacion

# Para aplicaciones cask, deberían estar en:
ls /Applications/

# Si no están ahí, crear symlink
brew uninstall --cask nombre-aplicacion
brew install --cask nombre-aplicacion
```

---

### 🌐 Búsqueda no funciona

**Síntomas:**
- Búsqueda no devuelve resultados
- "No applications found" para términos válidos
- Búsqueda muy lenta o se cuelga

**Causas posibles:**
1. Problema de conectividad
2. API de Homebrew no disponible
3. JavaScript deshabilitado

**Solución:**

**1. Verificar conectividad:**
```bash
# Probar API de Homebrew directamente
curl -s "https://formulae.brew.sh/api/formula.json" | head -10
```

**2. Limpiar cache del navegador:**
```javascript
// En DevTools → Console
localStorage.clear()
location.reload()
```

**3. Verificar JavaScript:**
- Asegurar que JavaScript esté habilitado
- Desactivar extensiones de bloqueo
- Probar en modo incógnito

**4. Usar búsqueda offline:**
- Las aplicaciones del catálogo local siempre funcionan
- No dependen de API externa

---

### 💾 Perfiles no se guardan

**Síntomas:**
- Perfiles desaparecen al recargar la página
- "Profile saved" pero no aparece en la lista
- Error al exportar/importar perfiles

**Causas posibles:**
1. LocalStorage deshabilitado
2. Modo incógnito/privado
3. Storage quota excedido

**Solución:**

**1. Verificar LocalStorage:**
```javascript
// En DevTools → Console
console.log(localStorage.getItem('ciderbrew_profiles'))

// Debería mostrar JSON con perfiles guardados
// Si es null, el storage no funciona
```

**2. Habilitar cookies y storage:**
- Configuración del navegador → Privacidad
- Permitir cookies y storage para ciderbrew.app
- Desactivar modo privado

**3. Limpiar storage si está lleno:**
```javascript
// En DevTools → Console
localStorage.clear()
```

**4. Exportar perfiles como respaldo:**
- Usar función "Exportar" para guardar como archivo JSON
- Importar cuando sea necesario

---

### 🖥️ Script falla en Apple Silicon

**Síntomas:**
- "Bad CPU type in executable"
- Aplicaciones Intel en Mac M1/M2/M3
- Rendimiento lento de aplicaciones

**Causa:** Aplicación Intel ejecutándose en Apple Silicon sin Rosetta

**Solución:**

**1. Instalar Rosetta 2:**
```bash
softwareupdate --install-rosetta --agree-to-license
```

**2. Usar versiones nativas cuando estén disponibles:**
```bash
# Verificar si hay versión Apple Silicon
brew info nombre-aplicacion

# Buscar alternativas nativas
brew search --cask nombre-aplicacion
```

**3. Forzar arquitectura específica:**
```bash
# Instalar versión Intel (con Rosetta)
arch -x86_64 brew install nombre-aplicacion

# Instalar versión ARM (nativa)
arch -arm64 brew install nombre-aplicacion
```

---

### 📱 Interfaz no se ve correctamente

**Síntomas:**
- Elementos superpuestos
- Texto cortado o ilegible
- Botones no clicables
- Layout roto en móvil

**Causas posibles:**
1. Zoom del navegador incorrecto
2. Extensiones interferentes
3. CSS no cargado completamente

**Solución:**

**1. Resetear zoom:**
```
Cmd + 0 (Mac) o Ctrl + 0 (Windows/Linux)
```

**2. Desactivar extensiones:**
- Probar en modo incógnito
- Desactivar ad blockers temporalmente

**3. Forzar recarga completa:**
```
Cmd + Shift + R (Mac) o Ctrl + Shift + R (Windows/Linux)
```

**4. Limpiar cache:**
- DevTools → Application → Storage → Clear site data

---

### 🔄 Script se descarga repetidamente

**Síntomas:**
- Cada clic en "Generate Script" descarga un nuevo archivo
- Múltiples archivos `install-apps.sh`, `install-apps (1).sh`, etc.
- No se puede abrir el archivo

**Causa:** Navegador descarga archivo en lugar de mostrar preview

**Solución:**

**1. Configurar aplicación por defecto:**
- Click derecho en archivo .sh
- "Abrir con" → Terminal

**2. Evitar descargas múltiples:**
- Hacer clic solo una vez en "Generate Script"
- Esperar a que termine la descarga

**3. Limpiar descargas:**
```bash
# Ir a carpeta de descargas
cd ~/Downloads

# Listar archivos de Ciderbrew
ls -la install-apps*

# Usar el más reciente
./install-apps.sh
```

---

### 🕒 Instalación muy lenta

**Síntomas:**
- Script toma horas en completar
- Se queda "colgado" en una aplicación
- Sin progreso visible

**Causas posibles:**
1. Internet lento
2. Aplicaciones muy grandes (Adobe, Xcode)
3. Servidor de descarga lento

**Solución:**

**1. Verificar progreso:**
```bash
# El script debería mostrar progreso
# Si no, ejecutar en modo verbose
bash -x install-apps.sh
```

**2. Instalar por lotes:**
```bash
# Dividir aplicaciones en grupos pequeños
# Generar múltiples scripts con 3-5 apps cada uno
```

**3. Monitorear conexión:**
```bash
# Verificar velocidad de descarga
brew install wget
wget --progress=bar https://formulae.brew.sh/api/formula.json
```

**4. Usar mirror más rápido:**
```bash
# Cambiar mirror de Homebrew (si es necesario)
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"
```

---

### 🎨 Modo oscuro no funciona

**Síntomas:**
- Interfaz siempre en modo claro
- Botón de tema no responde
- Inconsistencia entre elementos

**Causa:** Configuración de tema no persistida o CSS no cargado

**Solución:**

**1. Limpiar configuración de tema:**
```javascript
// En DevTools → Console
localStorage.removeItem('ciderbrew_theme')
location.reload()
```

**2. Verificar preferencia del sistema:**
- macOS: Preferencias del Sistema → General → Apariencia
- La opción "Auto" debería respetar esta configuración

**3. Forzar tema:**
```javascript
// En DevTools → Console
localStorage.setItem('ciderbrew_theme', 'dark')
location.reload()
```

---

### 📊 Aplicaciones duplicadas en la lista

**Síntomas:**
- Misma aplicación aparece múltiples veces
- Versiones diferentes de la misma app
- Confusión entre formula y cask

**Causa:** Aplicación disponible como formula y cask

**Explicación:**
- **Formula**: Herramientas de línea de comandos
- **Cask**: Aplicaciones con interfaz gráfica

**Solución:**

**Para usuarios normales:**
- Elegir la versión **cask** (aplicación con interfaz)
- Ejemplo: `visual-studio-code` (cask) vs `code-cli` (formula)

**Para desarrolladores:**
- Ambas versiones pueden ser útiles
- Cask para la app completa
- Formula para herramientas CLI

---

## 🆘 Problemas Específicos por Sistema

### macOS Monterey y posteriores

**Problema:** Aplicaciones requieren permisos adicionales

**Síntomas:**
- "App can't be opened because it is from an unidentified developer"
- Aplicación se instala pero no abre

**Solución:**
```bash
# Permitir aplicación específica
sudo spctl --master-disable

# O permitir individualmente:
# Sistema → Privacidad y Seguridad → Permitir aplicación
```

### macOS Big Sur

**Problema:** Rosetta 2 no instalado automáticamente

**Solución:**
```bash
softwareupdate --install-rosetta --agree-to-license
```

### macOS Catalina

**Problema:** Notarización de aplicaciones

**Solución:**
```bash
# Para aplicaciones no notarizadas
sudo xattr -r -d com.apple.quarantine /Applications/NombreApp.app
```

---

## 🔍 Herramientas de Diagnóstico

### Verificar Instalación de Homebrew

```bash
# Script de diagnóstico completo
echo "=== Homebrew Diagnostic ==="
echo "Homebrew version:"
brew --version

echo "Homebrew location:"
which brew

echo "Homebrew config:"
brew config

echo "Homebrew doctor:"
brew doctor

echo "=== System Info ==="
echo "macOS version:"
sw_vers

echo "Architecture:"
uname -m

echo "Shell:"
echo $SHELL
```

### Verificar Conectividad a APIs

```bash
# Script para verificar conexión a APIs
echo "=== API Connectivity Test ==="

echo "Testing Homebrew API..."
if curl -s --max-time 10 "https://formulae.brew.sh/api/formula.json" > /dev/null; then
    echo "✅ Homebrew API: OK"
else
    echo "❌ Homebrew API: FAIL"
fi

echo "Testing GitHub API..."
if curl -s --max-time 10 "https://api.github.com" > /dev/null; then
    echo "✅ GitHub API: OK"
else
    echo "❌ GitHub API: FAIL"
fi
```

### Verificar Estado del Storage

```javascript
// En DevTools → Console
function diagnoseCiderbrew() {
    console.log('=== Ciderbrew Diagnostic ===')
    
    // LocalStorage
    console.log('LocalStorage available:', typeof(Storage) !== "undefined")
    console.log('Selected apps:', localStorage.getItem('ciderbrew_selected_apps'))
    console.log('Profiles:', localStorage.getItem('ciderbrew_profiles'))
    console.log('Theme:', localStorage.getItem('ciderbrew_theme'))
    
    // Storage quota
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
            console.log('Storage quota:', estimate.quota)
            console.log('Storage usage:', estimate.usage)
            console.log('Storage available:', estimate.quota - estimate.usage)
        })
    }
    
    // Network status
    console.log('Online:', navigator.onLine)
    console.log('User agent:', navigator.userAgent)
}

diagnoseCiderbrew()
```

---

## 📞 Obtener Ayuda Adicional

### Información para Reportar Bugs

Cuando reportes un problema, incluye esta información:

```bash
# Información del sistema
echo "=== System Information ==="
echo "macOS: $(sw_vers -productVersion)"
echo "Architecture: $(uname -m)"
echo "Shell: $SHELL"
echo "Homebrew: $(brew --version 2>/dev/null || echo 'Not installed')"

echo "=== Browser Information ==="
# Información del navegador (en DevTools → Console)
console.log('Browser:', navigator.userAgent)
console.log('Cookies enabled:', navigator.cookieEnabled)
console.log('Local storage:', typeof(Storage) !== "undefined")
```

### Canales de Soporte

1. **GitHub Issues**: [Reportar bug](https://github.com/thebrokenbrain/macos-setup-assistant/issues)
2. **GitHub Discussions**: [Hacer pregunta](https://github.com/thebrokenbrain/macos-setup-assistant/discussions)
3. **Documentación**: [docs/README.md](./README.md)

### Plantilla para Reportar Issues

```markdown
## Descripción del Problema
[Descripción clara del problema]

## Pasos para Reproducir
1. Ir a...
2. Hacer clic en...
3. Ver error...

## Comportamiento Esperado
[Qué esperabas que pasara]

## Comportamiento Actual
[Qué pasó realmente]

## Información del Sistema
- macOS: [versión]
- Navegador: [Chrome/Safari/Firefox + versión]
- Homebrew: [versión o "no instalado"]

## Información Adicional
[Screenshots, logs, etc.]
```

---

## 💡 Tips de Prevención

### Mejores Prácticas

1. **Mantén Homebrew actualizado:**
   ```bash
   brew update && brew upgrade
   ```

2. **Verifica antes de generar scripts grandes:**
   - Empieza con 2-3 aplicaciones
   - Prueba que funcionen antes de agregar más

3. **Guarda perfiles frecuentemente:**
   - Exporta configuraciones importantes como JSON
   - Haz backup antes de cambios grandes

4. **Monitorea el espacio en disco:**
   ```bash
   df -h
   brew cleanup  # Limpiar cache de Homebrew
   ```

5. **Lee los logs durante instalación:**
   - Si algo falla, los logs te dirán qué pasó
   - Usa modo verbose para más información

### Configuración Recomendada

```bash
# Configuración óptima de Homebrew
export HOMEBREW_NO_AUTO_UPDATE=1  # No actualizar en cada install
export HOMEBREW_CLEANUP_PERIODIC_FULL_DAYS=7  # Cleanup automático
export HOMEBREW_BAT=1  # Usar bat para mejores diffs
export HOMEBREW_NO_ANALYTICS=1  # Disable analytics si prefieres
```

---

**¿Tu problema no aparece aquí? [Crea un issue](https://github.com/thebrokenbrain/macos-setup-assistant/issues) y te ayudaremos! 🤝**
