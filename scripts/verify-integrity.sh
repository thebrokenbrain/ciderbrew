#!/bin/bash

# Pre-commit hook for file integrity verification
# This script prevents commits when critical files are empty or corrupted

set -e

echo "🔍 Verificando integridad de archivos críticos..."

# Array de archivos críticos que no deben estar vacíos
CRITICAL_FILES=(
    "src/App.tsx"
    "src/main.tsx"
    "src/types/index.ts"
    "src/types/api.ts"
    "src/data/apps.ts"
    "src/hooks/useAppSelection.ts"
    "src/components/Header.tsx"
    "src/components/SearchInterface.tsx"
)

# Verificar que archivos críticos existen y no están vacíos
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ ERROR: Archivo crítico faltante: $file"
        exit 1
    fi
    
    # Verificar que el archivo no está vacío
    if [ ! -s "$file" ]; then
        echo "❌ ERROR: Archivo crítico vacío: $file"
        exit 1
    fi
    
    # Verificar contenido mínimo (más de 10 caracteres sin espacios)
    content_size=$(tr -d '[:space:]' < "$file" | wc -c)
    if [ "$content_size" -lt 10 ]; then
        echo "❌ ERROR: Archivo crítico con contenido insuficiente: $file"
        exit 1
    fi
    
    echo "✅ $file - OK"
done

# Verificaciones específicas de contenido
echo "🔍 Verificando contenido específico..."

# App.tsx debe tener estructura React válida
if ! grep -q "function App\|const App.*=" "src/App.tsx"; then
    echo "❌ ERROR: App.tsx no contiene una función App válida"
    exit 1
fi

if ! grep -q "export default App" "src/App.tsx"; then
    echo "❌ ERROR: App.tsx no exporta App por defecto"
    exit 1
fi

if ! grep -q "return" "src/App.tsx"; then
    echo "❌ ERROR: App.tsx no tiene un return JSX"
    exit 1
fi

# main.tsx debe tener la estructura de arranque
if ! grep -q "ReactDOM\|createRoot" "src/main.tsx"; then
    echo "❌ ERROR: main.tsx no contiene la inicialización de React"
    exit 1
fi

# apps.ts debe tener datos de aplicaciones
app_count=$(grep -c "id:" "src/data/apps.ts" || echo "0")
if [ "$app_count" -lt 20 ]; then
    echo "❌ ERROR: apps.ts contiene muy pocas aplicaciones ($app_count)"
    exit 1
fi

echo "✅ Todas las verificaciones de integridad pasaron"

# Ejecutar tests de integridad específicos
echo "🧪 Ejecutando tests de integridad..."
npm run test:integrity

echo "🎉 ¡Verificación de integridad completada exitosamente!"
