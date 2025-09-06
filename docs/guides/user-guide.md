# 👆 Guía de Usuario de Ciderbrew

*Una guía completa para usar Ciderbrew sin necesidad de conocimientos técnicos*

## 🎯 ¿Qué puedes hacer con Ciderbrew?

Ciderbrew te permite instalar múltiples aplicaciones en tu Mac de una sola vez, sin tener que:
- Buscar cada aplicación en internet
- Descargar archivos .dmg uno por uno
- Instalar manualmente cada programa
- Preocuparte por actualizaciones

## 🚀 Empezando

### Paso 1: Acceder a Ciderbrew
1. Abre tu navegador web (Safari, Chrome, Firefox, etc.)
2. Ve a [ciderbrew.app](https://ciderbrew.app)
3. ¡Ya estás listo para empezar!

### Paso 2: Familiarizarte con la Interfaz

#### 🔍 Barra de Búsqueda
- Está en la parte superior
- Escribe el nombre de cualquier aplicación
- Los resultados aparecen instantáneamente

#### 📂 Categorías
- **Navegadores**: Chrome, Firefox, Safari, etc.
- **Desarrollo**: Visual Studio Code, Xcode, etc.
- **Productividad**: Notion, Slack, Microsoft Office, etc.
- **Multimedia**: VLC, Spotify, Adobe Creative Suite, etc.
- **Utilidades**: CleanMyMac, 1Password, etc.

#### 🎨 Tarjetas de Aplicaciones
Cada aplicación se muestra como una tarjeta que incluye:
- **Icono** de la aplicación
- **Nombre** y descripción
- **Botón de selección** (se pone verde cuando está seleccionada)

## 🎯 Seleccionando Aplicaciones

### Método 1: Por Categorías
1. Haz clic en una categoría (ej: "Navegadores")
2. Verás todas las aplicaciones de esa categoría
3. Haz clic en las aplicaciones que quieras instalar
4. Las tarjetas seleccionadas se pondrán verdes

### Método 2: Por Búsqueda
1. Escribe en la barra de búsqueda
2. Por ejemplo: "photoshop", "chrome", "code"
3. Haz clic en los resultados que te interesen

### Método 3: Exploración Libre
1. Desplázate por todas las aplicaciones disponibles
2. Haz clic en cualquier aplicación que te llame la atención

## 📝 Generando tu Script de Instalación

### ¿Qué es un Script?
Un script es como una "lista de tareas" que tu computadora puede ejecutar automáticamente. En este caso, es una lista de todas las aplicaciones que quieres instalar.

### Pasos para Generar el Script
1. **Selecciona** todas las aplicaciones que quieres
2. **Ve a la sección "Script Generator"** (parte inferior de la página)
3. **Configura opciones** (opcional):
   - ✅ **Auto-update**: Mantener aplicaciones actualizadas
   - ✅ **Cleanup**: Limpiar archivos temporales
   - ✅ **Verbose**: Mostrar información detallada
4. **Haz clic en "Generar Script"**
5. **Descarga** el archivo que se genera

## 💾 Guardando y Compartiendo Configuraciones

### Guardar tu Selección (Perfiles)
1. Después de seleccionar aplicaciones, ve a "Perfiles"
2. Haz clic en "Guardar Perfil"
3. Dale un nombre descriptivo: "Setup para Diseño", "Apps de Trabajo", etc.
4. Tu configuración se guarda automáticamente

### Exportar Configuraciones
1. En la sección "Perfiles"
2. Haz clic en "Exportar"
3. Se descarga un archivo JSON con tu configuración
4. Puedes compartir este archivo con amigos o colegas

### Importar Configuraciones
1. Si alguien te comparte un archivo de configuración
2. Ve a "Perfiles" → "Importar"
3. Selecciona el archivo JSON
4. Todas las aplicaciones se seleccionarán automáticamente

## 🔧 Ejecutando el Script de Instalación

### Prerequisito: Instalar Homebrew
Si es tu primera vez usando Homebrew:

1. Abre **Terminal** (búscala en Spotlight con Cmd+Espacio)
2. Copia y pega este comando:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
3. Presiona Enter y sigue las instrucciones
4. Esto solo se hace UNA vez

### Ejecutar tu Script
1. **Encuentra el archivo** que descargaste (probablemente en "Descargas")
2. **Abre Terminal**
3. **Arrastra el archivo** desde Finder hasta Terminal
4. **Presiona Enter**
5. **Espera** a que termine (puede tomar varios minutos)

### ¿Qué Verás Durante la Instalación?
- Texto moviéndose rápidamente (es normal)
- Nombres de aplicaciones siendo instaladas
- Barras de progreso ocasionales
- Al final: "✅ Instalación completada"

## 🎨 Personalización de la Interfaz

### Cambiar Tema
1. En la esquina superior derecha, busca el ícono de luna/sol
2. Haz clic para cambiar entre:
   - 🌞 **Modo Claro**: Fondo blanco, texto negro
   - 🌙 **Modo Oscuro**: Fondo negro, texto blanco
   - 🔄 **Automático**: Cambia según la hora del día

### Ajustar Tamaño de Texto
- Tu navegador puede hacer zoom: Cmd + (+) para agrandar, Cmd + (-) para reducir

## ❓ Preguntas Frecuentes

### ¿Es Seguro?
✅ **Sí, completamente**
- Ciderbrew solo usa fuentes oficiales
- Homebrew es ampliamente usado y confiable
- No se instalan aplicaciones piratas o modificadas

### ¿Cuánto Tiempo Toma?
⏱️ **Depende de cuántas aplicaciones**
- 1-5 aplicaciones: 5-10 minutos
- 10+ aplicaciones: 20-30 minutos
- Aplicaciones grandes (Adobe): Pueden tomar horas

### ¿Necesito Conocimientos Técnicos?
❌ **No necesitas saber programar**
- Solo saber usar un navegador web
- Copiar y pegar comandos básicos
- Seguir instrucciones paso a paso

### ¿Qué Pasa si Algo Sale Mal?
🔧 **Soluciones Comunes**
- Reinicia Terminal e intenta de nuevo
- Verifica tu conexión a internet
- Lee la [Guía de Solución de Problemas](./troubleshooting.md)

### ¿Puedo Instalar Solo Algunas Aplicaciones?
✅ **Por supuesto**
- Puedes seleccionar solo una aplicación si quieres
- O cambiar tu selección en cualquier momento
- Genera un nuevo script cuando hagas cambios

### ¿Las Aplicaciones se Actualizan Solas?
🔄 **Depende de tus Configuraciones**
- Si marcaste "Auto-update": Sí
- Si no: Puedes actualizarlas manualmente con `brew upgrade`

## 💡 Tips y Trucos

### Para Nuevos Usuarios de Mac
1. **Empieza pequeño**: Selecciona solo 3-5 aplicaciones esenciales primero
2. **Apps recomendadas para empezar**:
   - Chrome o Firefox (navegador)
   - Visual Studio Code (editor de texto)
   - VLC (reproductor de video)
   - Spotify (música)

### Para Usuarios Avanzados
1. **Crea perfiles específicos**: "Setup Trabajo", "Setup Personal", "Setup Desarrollo"
2. **Usa la búsqueda**: Es más rápido que navegar categorías
3. **Combina fuentes**: Usa apps del catálogo + búsqueda de Homebrew

### Para Equipos de Trabajo
1. **Estandariza configuraciones**: Todos usan el mismo perfil exportado
2. **Documenta**: Incluye notas sobre por qué elegiste ciertas aplicaciones
3. **Versiona**: Guarda diferentes versiones para diferentes roles

## 🎓 Próximos Pasos

Una vez que domines Ciderbrew básico, puedes:

1. **[Aprender sobre Homebrew](../technical/technologies.md#homebrew)** - La herramienta que hace la magia
2. **[Explorar funciones avanzadas](./advanced-features.md)** - Scripts personalizados, automatización
3. **[Contribuir al proyecto](./contributing.md)** - Ayudar a mejorar Ciderbrew

---

## 🆘 ¿Necesitas Más Ayuda?

- **[Solución de Problemas](./troubleshooting.md)** - Problemas comunes y soluciones
- **[Comunidad en GitHub](https://github.com/thebrokenbrain/macos-setup-assistant/discussions)** - Haz preguntas y comparte tips
- **[Reportar Bugs](https://github.com/thebrokenbrain/macos-setup-assistant/issues)** - Si algo no funciona como debería

*¡Esperamos que disfrutes usando Ciderbrew! 🍎✨*
