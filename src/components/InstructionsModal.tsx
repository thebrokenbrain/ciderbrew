/**
 * Componente InstructionsModal - Modal con instrucciones de uso de Ciderbrew
 */

import React from 'react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fas fa-info text-white text-sm"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Cómo usar Ciderbrew 🍏
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          >
            <i className="fas fa-times text-gray-500 dark:text-gray-400"></i>
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 160px)' }}>
          {/* Introducción */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                ¿Qué es Ciderbrew?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Ciderbrew es un asistente visual para automatizar la instalación de aplicaciones en macOS usando <strong>Homebrew</strong>. 
                Selecciona las apps que necesitas, genera un script personalizado y ejecuta una instalación completamente automatizada.
              </p>
            </div>
          </div>

          {/* Instrucciones paso a paso */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0">1</span>
                Selecciona aplicaciones
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                    <span>Navega por las categorías (Desarrollo, Productividad, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                    <span>Haz clic en las aplicaciones que quieres instalar</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                    <span>Usa filtros avanzados para refinar tu búsqueda</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-exclamation-triangle text-yellow-500 mt-1 mr-3 flex-shrink-0"></i>
                    <div>
                      <span>Las apps marcadas como </span>
                      <span className="bg-red-100 dark:bg-red-900/30 px-1 rounded whitespace-nowrap">deprecadas</span>
                      <span> pueden no funcionar</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0">2</span>
                Genera tu script
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <i className="fas fa-file-code text-blue-500 mt-1 mr-3 flex-shrink-0"></i>
                    <span>Elige el formato: Script .sh, Comandos o Brewfile</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-download text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                    <span>Descarga el archivo generado</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-terminal text-purple-500 mt-1 mr-2 flex-shrink-0"></i>
                    <div>
                      <span>Ejecuta en Terminal:</span>
                      <code className="block bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded mt-1 text-xs break-all">
                        chmod +x script.sh && ./script.sh
                      </code>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Gestión de Perfiles */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
              Gestiona tus perfiles
            </h3>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">
                    <i className="fas fa-save mr-2"></i>Crear y guardar perfiles
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Guarda combinaciones de apps para diferentes usos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Perfiles para "Desarrollo Web", "Diseño", "Gaming", etc.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Carga perfiles con un solo clic</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">
                    <i className="fas fa-hdd mr-2"></i>Almacenamiento local
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Los perfiles se guardan en el <strong>localStorage</strong> del navegador</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Solo tú tienes acceso a tus perfiles</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Exporta/importa perfiles para compartir o respaldar</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Agradecimientos y créditos */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <i className="fas fa-heart text-red-500 mr-2"></i>
              Agradecimientos y créditos
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                  <i className="fas fa-beer mr-2"></i>Gracias al equipo de Homebrew
                </h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Este proyecto no sería posible sin el increíble trabajo del equipo de <strong>Homebrew</strong>. 
                  Su gestor de paquetes ha revolucionado la forma en que instalamos software en macOS, 
                  proporcionando una experiencia simple y confiable que hace que la gestión de aplicaciones sea un placer.
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-2">
                  Visita <a href="https://brew.sh" target="_blank" rel="noopener noreferrer" className="text-orange-600 dark:text-orange-400 hover:underline">brew.sh</a> para conocer más sobre Homebrew.
                </p>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
                <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                  <i className="fas fa-magic mr-2"></i>Experimento con Vibe Coding
                </h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  Ciderbrew es un experimento creado usando <strong>"vibe coding"</strong> - una tendencia emergente en el desarrollo 
                  de software donde un desarrollador interactúa con una Inteligencia Artificial para generar código basándose en 
                  instrucciones de lenguaje natural, haciendo que el desarrollo sea más rápido y accesible.
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  El término fue popularizado por <strong>Andrej Karpathy</strong> a principios de 2025 y describe un flujo de trabajo 
                  conversacional, donde el rol del programador cambia de escribir código línea por línea a guiar a la IA a través de 
                  un proceso de generación y refinamiento.
                </p>
              </div>
            </div>
          </div>

          {/* Información técnica */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              <i className="fas fa-code mr-2"></i>Información técnica
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <strong>Frontend:</strong> React 19 + TypeScript
              </div>
              <div>
                <strong>Styling:</strong> Tailwind CSS
              </div>
              <div>
                <strong>Bundler:</strong> Vite
              </div>
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-600 flex-shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <i className="fas fa-check mr-2"></i>
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;
