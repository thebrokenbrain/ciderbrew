import React from 'react';
import type { SearchableApp } from './types/api';
import { Header } from './components/Header';
import SearchInterface from './components/SearchInterface';
import { ScriptSection } from './components/ScriptSection';
import { ToastContainer } from './components/ToastContainer';
import { useAppSelection } from './hooks/useAppSelection';

function App() {
  const {
    count,
    selectedIds,
    toasts,
    toggleApp,
    getSelectedApps,
    clearSelection,
    addToast,
    removeToast
  } = useAppSelection();

  const [showScriptSection, setShowScriptSection] = React.useState(false);

  const handleAppSelect = (app: SearchableApp, isSelected: boolean) => {
    console.log('📱 App - Recibiendo selección:', app.name, 'isSelected:', isSelected);
    
    toggleApp(app, isSelected);
    
    if (isSelected) {
      addToast({
        message: `${app.name} agregado a la selección`,
        type: 'success',
        duration: 2000
      });
    }
  };

  const handleGenerateScript = () => {
    if (count === 0) {
      addToast({
        message: 'Selecciona al menos una aplicación para generar el script',
        type: 'warning',
        duration: 3000
      });
      return;
    }
    setShowScriptSection(true);
  };

  const handleCloseScript = () => {
    setShowScriptSection(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {/* Header */}
        <Header 
          selectedCount={count}
          totalApps={0} // Not applicable for dynamic search
        />
        
        {/* Main Content */}
        <main className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          {/* Action Bar */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Selection Info */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-blue-500"></i>
                  <span className="text-sm font-medium text-gray-700">
                    {count} aplicación{count !== 1 ? 'es' : ''} seleccionada{count !== 1 ? 's' : ''}
                  </span>
                </div>
                {count > 0 && (
                  <button
                    onClick={clearSelection}
                    className="text-xs text-red-600 hover:text-red-700 underline"
                  >
                    Limpiar selección
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleGenerateScript}
                  disabled={count === 0}
                  className={`
                    px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center space-x-2
                    transition-all duration-200
                    ${count > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <i className="fas fa-code text-sm"></i>
                  <span>Generar Script</span>
                  {count > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Search Interface */}
          <div className="p-4 sm:p-6">
            <SearchInterface
              onAppSelect={handleAppSelect}
              selectedApps={selectedIds}
            />
          </div>
        </main>

        {/* Script Section */}
        {showScriptSection && (
          <ScriptSection
            selectedApps={getSelectedApps()}
            onClose={handleCloseScript}
            onToast={addToast}
          />
        )}

        {/* Toast Container */}
        <ToastContainer
          toasts={toasts}
          onRemoveToast={removeToast}
        />
      </div>
    </div>
  );
}

export default App;
