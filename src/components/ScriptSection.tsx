import React, { useState, useEffect } from 'react';
import type { SearchableApp } from '../types/api';
import type { Toast } from '../types';
import { ScriptGenerator } from '../services/ScriptGenerator';

interface ScriptSectionProps {
  selectedApps: SearchableApp[];
  onClose: () => void;
  onToast: (toast: Omit<Toast, 'id'>) => void;
}

export const ScriptSection: React.FC<ScriptSectionProps> = ({ 
  selectedApps, 
  onClose,
  onToast
}) => {
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [scriptType, setScriptType] = useState<'script' | 'commands' | 'brewfile'>('script');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptOptions, setScriptOptions] = useState({
    includeUpdates: true,
    includeCleanup: true,
    verboseOutput: false,
    skipConfirmations: false,
    customHeader: ''
  });

  // Auto-generate script when component mounts
  useEffect(() => {
    generateScript();
  }, [selectedApps, scriptType, scriptOptions]);

  const generateScript = async () => {
    if (selectedApps.length === 0) return;

    setIsGenerating(true);
    try {
      let script = '';
      
      switch (scriptType) {
        case 'script':
          script = ScriptGenerator.generateInstallScript(selectedApps, scriptOptions);
          break;
        case 'commands':
          script = ScriptGenerator.generateCommandList(selectedApps);
          break;
        case 'brewfile':
          script = ScriptGenerator.generateBrewfile(selectedApps);
          break;
      }
      
      setGeneratedScript(script);
    } catch (error) {
      console.error('Error generating script:', error);
      onToast({
        message: 'Error al generar el script',
        type: 'error',
        duration: 3000
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadScript = () => {
    const filenames = {
      script: 'macos-setup.sh',
      commands: 'brew-commands.txt',
      brewfile: 'Brewfile'
    };

    const blob = new Blob([generatedScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filenames[scriptType];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onToast({
      message: `${filenames[scriptType]} descargado exitosamente`,
      type: 'success',
      duration: 3000
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedScript);
      onToast({
        message: 'Script copiado al portapapeles',
        type: 'success',
        duration: 3000
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      onToast({
        message: 'Error al copiar al portapapeles',
        type: 'error',
        duration: 3000
      });
    }
  };

  const brewApps = selectedApps.filter(app => app.installType === 'brew');
  const caskApps = selectedApps.filter(app => app.installType === 'brew-cask');

  return (
    <div className="mt-6 bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <i className="fas fa-code text-xl"></i>
          <div>
            <h2 className="text-lg font-semibold">Generador de Script</h2>
            <p className="text-gray-300 text-sm">
              {selectedApps.length} aplicación{selectedApps.length !== 1 ? 'es' : ''} seleccionada{selectedApps.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white transition-colors duration-200"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* App Summary */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="fas fa-terminal text-green-600"></i>
              <span className="font-medium text-green-800">Herramientas CLI</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{brewApps.length}</p>
          </div>
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="fas fa-desktop text-primary-600"></i>
              <span className="font-medium text-primary-800">Aplicaciones</span>
            </div>
            <p className="text-2xl font-bold text-primary-600">{caskApps.length}</p>
          </div>
        </div>

        {/* Script Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de salida:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setScriptType('script')}
              className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                scriptType === 'script'
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-file-code mr-2"></i>
              Script Bash
            </button>
            <button
              onClick={() => setScriptType('commands')}
              className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                scriptType === 'commands'
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-list mr-2"></i>
              Lista de Comandos
            </button>
            <button
              onClick={() => setScriptType('brewfile')}
              className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                scriptType === 'brewfile'
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-cube mr-2"></i>
              Brewfile
            </button>
          </div>
        </div>

        {/* Script Options (only for bash script) */}
        {scriptType === 'script' && (
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Opciones del script:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scriptOptions.includeUpdates}
                  onChange={(e) => setScriptOptions(prev => ({ ...prev, includeUpdates: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Incluir actualizaciones</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scriptOptions.includeCleanup}
                  onChange={(e) => setScriptOptions(prev => ({ ...prev, includeCleanup: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Incluir limpieza</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scriptOptions.verboseOutput}
                  onChange={(e) => setScriptOptions(prev => ({ ...prev, verboseOutput: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Salida detallada</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scriptOptions.skipConfirmations}
                  onChange={(e) => setScriptOptions(prev => ({ ...prev, skipConfirmations: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Sin confirmaciones</span>
              </label>
            </div>
          </div>
        )}

        {/* Script Display */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">
              Script generado:
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                disabled={isGenerating || !generatedScript}
                className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors duration-200 disabled:opacity-50"
              >
                <i className="fas fa-copy mr-1"></i>
                Copiar
              </button>
              <button
                onClick={downloadScript}
                disabled={isGenerating || !generatedScript}
                className="px-3 py-1 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors duration-200 disabled:opacity-50"
              >
                <i className="fas fa-download mr-1"></i>
                Descargar
              </button>
            </div>
          </div>
          
          <div className="relative">
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
              {isGenerating ? (
                <div className="flex items-center space-x-2 text-gray-400">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Generando script...</span>
                </div>
              ) : (
                <code>{generatedScript || '# Selecciona aplicaciones para generar el script'}</code>
              )}
            </pre>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <i className="fas fa-info-circle text-amber-600 mt-1"></i>
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Instrucciones de uso:</p>
              {scriptType === 'script' && (
                <ul className="space-y-1">
                  <li>1. Descarga el archivo .sh</li>
                  <li>2. Hazlo ejecutable: <code className="bg-amber-100 px-1 rounded">chmod +x macos-setup.sh</code></li>
                  <li>3. Ejecuta: <code className="bg-amber-100 px-1 rounded">./macos-setup.sh</code></li>
                </ul>
              )}
              {scriptType === 'commands' && (
                <ul className="space-y-1">
                  <li>• Copia y pega los comandos en tu terminal uno por uno</li>
                  <li>• O ejecuta todos a la vez copiando todo el contenido</li>
                </ul>
              )}
              {scriptType === 'brewfile' && (
                <ul className="space-y-1">
                  <li>1. Guarda como "Brewfile" (sin extensión)</li>
                  <li>2. Ejecuta: <code className="bg-amber-100 px-1 rounded">brew bundle --file=Brewfile</code></li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
