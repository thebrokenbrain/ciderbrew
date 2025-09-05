import { useState, useEffect } from 'react';
import type { App } from '../types';
import { ScriptGenerator } from '../services/ScriptGenerator';

interface ScriptSectionProps {
  selectedApps: App[];
  hasSelections: boolean;
  selectedCount: number;
  onShowToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  onHideScript: () => void;
  autoGenerate?: boolean;
}

export const ScriptSection = ({ 
  selectedApps, 
  hasSelections, 
  selectedCount, 
  onShowToast,
  onHideScript,
  autoGenerate = false
}: ScriptSectionProps) => {
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-generate script when component mounts if autoGenerate is true
  useEffect(() => {
    if (autoGenerate && hasSelections && !generatedScript) {
      generateScript();
    }
  }, [autoGenerate, hasSelections]);

  const generateScript = async () => {
    if (!hasSelections) {
      onShowToast('Selecciona al menos una aplicación para instalar', 'error');
      return;
    }

    setIsGenerating(true);
    
    // Simulate generation delay for better UX
    setTimeout(() => {
      const script = ScriptGenerator.generate(selectedApps);
      setGeneratedScript(script);
      setIsGenerating(false);
      onShowToast('Script generado correctamente');
      
      // Scroll to script section
      document.querySelector('.script-preview')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 1000);
  };

  const downloadScript = () => {
    if (!generatedScript) {
      onShowToast('Primero genera el script', 'error');
      return;
    }

    ScriptGenerator.downloadScript(generatedScript);
    onShowToast('Script descargado como macos-setup.sh');
  };

  const copyScript = async () => {
    if (!generatedScript) {
      onShowToast('Primero genera el script', 'error');
      return;
    }

    try {
      await ScriptGenerator.copyToClipboard(generatedScript);
      onShowToast('Script copiado al portapapeles');
    } catch (error) {
      onShowToast('Error al copiar el script', 'error');
    }
  };

  const getStatusMessage = () => {
    if (generatedScript) {
      return `Script generado con ${selectedCount} aplicaciones - Listo para descargar`;
    } else if (hasSelections) {
      return `${selectedCount} aplicaciones seleccionadas - Listo para generar script`;
    } else {
      return 'Selecciona aplicaciones para generar el script';
    }
  };

  const getStatusColor = () => {
    if (generatedScript) return 'text-green-600';
    if (hasSelections) return 'text-blue-600';
    return 'text-gray-500';
  };

  return (
    <div className="mt-10 bg-gray-50 rounded-2xl p-8">
      {/* Selected Apps Summary */}
      {hasSelections && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <i className="fa fa-list-check text-blue-600"></i>
            <h3 className="font-semibold text-blue-900">
              Aplicaciones seleccionadas ({selectedCount})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {selectedApps.map((app) => (
              <div key={app.id} className="flex items-center gap-2 text-sm">
                <i className={`fa ${app.icon} text-blue-600 w-4`}></i>
                <span className="text-blue-800">{app.name}</span>
                <span className="text-xs bg-blue-200 text-blue-700 px-1 rounded">
                  {app.installType}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
        <button
          onClick={onHideScript}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-gray-500 text-white hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base"
        >
          <i className="fa fa-arrow-left"></i>
          <span className="hidden sm:inline">Volver a Selección</span>
          <span className="sm:hidden">Volver</span>
        </button>

        <button
          onClick={generateScript}
          disabled={!hasSelections || isGenerating}
          className={`
            flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base
            ${hasSelections && !isGenerating
              ? 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generando...
            </>
          ) : (
            <>
              <i className="fa fa-refresh"></i>
              {generatedScript ? 'Regenerar Script' : 'Generar Script'}
            </>
          )}
        </button>

        <button
          onClick={downloadScript}
          disabled={!generatedScript}
          className={`
            flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base
            ${generatedScript
              ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <i className="fa fa-download"></i>
          <span className="hidden sm:inline">Descargar .sh</span>
          <span className="sm:hidden">Descargar</span>
        </button>

        <button
          onClick={copyScript}
          disabled={!generatedScript}
          className={`
            flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base
            ${generatedScript
              ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <i className="fa fa-copy"></i>
          <span className="hidden sm:inline">Copiar</span>
          <span className="sm:hidden">Copiar</span>
        </button>
      </div>

      {/* Script Preview */}
      <div className="script-preview bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Script de Instalación
          </h3>
          <span className={`text-sm font-medium italic ${getStatusColor()}`}>
            {getStatusMessage()}
          </span>
        </div>
        
        <div className="p-4 sm:p-6">
          <pre className="bg-gray-900 text-green-400 p-4 sm:p-6 rounded-lg overflow-x-auto min-h-[200px] text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap">
            {generatedScript || `# Tu script aparecerá aquí...
# Selecciona las aplicaciones que deseas instalar y haz clic en "Generar Script"
#
# El script incluirá:
# - Instalación automática de Homebrew
# - Gestión de errores y verificaciones
# - Mensajes de progreso informativos
# - Instrucciones post-instalación
#
# ¡Todo listo para ejecutar en tu Mac! 🚀`}
          </pre>
        </div>
      </div>

      {/* Usage Instructions */}
      {generatedScript && (
        <div className="mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <i className="fa fa-info-circle text-blue-500 mt-1 text-sm sm:text-base"></i>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
                Cómo usar el script:
              </h4>
              <ol className="text-xs sm:text-sm text-blue-800 space-y-1">
                <li>1. Descarga el archivo <code className="bg-white px-1 rounded text-xs">macos-setup.sh</code></li>
                <li>2. Abre Terminal y navega a la carpeta</li>
                <li>3. Ejecuta: <code className="bg-white px-1 rounded text-xs">chmod +x macos-setup.sh</code></li>
                <li>4. Ejecuta: <code className="bg-white px-1 rounded text-xs">./macos-setup.sh</code></li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
