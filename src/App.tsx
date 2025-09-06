import React, { useState } from 'react';
import type { SearchableApp } from './types/api';
import { Header } from './components/Header';
import SearchInterface from './components/SearchInterface';
import { ScriptSection } from './components/ScriptSection';
import { ToastContainer } from './components/ToastContainer';
import { ProfileManager } from './components/ProfileManager';
import SelectedAppsModal from './components/SelectedAppsModal';
import useAppSelection from './hooks/useAppSelection';
import { useTheme } from './hooks/useTheme';

function App() {
  const {
    count,
    selectedIds,
    toasts,
    toggleApp,
    getSelectedApps,
    clearSelection,
    addToast,
    removeToast,
    profiles,
    currentProfile,
    createProfile,
    loadProfile,
    deleteProfile,
    updateCurrentProfile,
    exportConfiguration,
    importConfiguration
  } = useAppSelection();

  const { } = useTheme(); // Hook necesario para inicializar el tema

  const [showScriptSection, setShowScriptSection] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [showSelectedApps, setShowSelectedApps] = useState(false);

  const handleAppSelect = (app: SearchableApp, isSelected: boolean) => {
    console.log('📱 App - Recibiendo selección:', app.name, 'isSelected:', isSelected);
    
    toggleApp(app, isSelected);
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
    
    // Scroll to script section after it's rendered
    setTimeout(() => {
      const scriptSection = document.getElementById('script-section');
      if (scriptSection) {
        scriptSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const handleCloseScript = () => {
    setShowScriptSection(false);
  };

  const handleShowSelectedApps = () => {
    if (count > 0) {
      setShowSelectedApps(true);
    }
  };

  const handleRemoveSelectedApp = (appId: string) => {
    // Encontrar la app en las seleccionadas y togglearla
    const selectedApps = getSelectedApps();
    const appToRemove = selectedApps.find(app => app.id === appId);
    if (appToRemove) {
      toggleApp(appToRemove, false);
    }
  };

  const handleProfileLoad = (profileId: string) => {
    try {
      loadProfile(profileId);
      setShowProfileManager(false);
      addToast({
        message: 'Perfil cargado correctamente',
        type: 'success',
        duration: 3000
      });
    } catch (error) {
      addToast({
        message: 'Error al cargar el perfil',
        type: 'error',
        duration: 3000
      });
    }
  };

  const handleProfileCreate = (name: string, description?: string) => {
    try {
      createProfile(name, description || '');
      addToast({
        message: `Perfil "${name}" creado correctamente`,
        type: 'success',
        duration: 3000
      });
    } catch (error) {
      addToast({
        message: 'Error al crear el perfil',
        type: 'error',
        duration: 3000
      });
    }
  };

  const handleProfileDelete = (profileId: string) => {
    deleteProfile(profileId);
  };

  const handleExportConfiguration = () => {
    try {
      exportConfiguration();
      addToast({
        message: 'Configuración exportada correctamente',
        type: 'success',
        duration: 3000
      });
    } catch (error) {
      addToast({
        message: 'Error al exportar la configuración',
        type: 'error',
        duration: 3000
      });
    }
  };

  const handleImportConfiguration = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        // Crear un evento sintético para importConfiguration
        const mockEvent = {
          target: {
            files: [file]
          }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        
        importConfiguration(mockEvent);
        addToast({
          message: 'Configuración importada correctamente',
          type: 'success',
          duration: 3000
        });
      } catch (error) {
        addToast({
          message: 'Error al importar la configuración',
          type: 'error',
          duration: 3000
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImportConfigurationEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImportConfiguration(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-100 dark:from-secondary-900 dark:to-secondary-800 text-secondary-900 dark:text-white transition-all duration-300">
      <div className="min-h-screen">
        {/* Header */}
        <Header 
          selectedCount={count}
          currentProfile={currentProfile}
          onShowSelectedApps={handleShowSelectedApps}
        />
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats and Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Selection Info */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <i className="fas fa-layer-group text-primary-600 dark:text-primary-400 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {count === 0 
                          ? 'Sin aplicaciones seleccionadas' 
                          : `${count} aplicación${count > 1 ? 'es' : ''} seleccionada${count > 1 ? 's' : ''}`
                        }
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        'Selecciona las aplicaciones que deseas instalar'
                      </p>
                    </div>
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
                    onClick={() => setShowProfileManager(true)}
                    className="px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200"
                  >
                    <i className="fas fa-user-cog text-sm"></i>
                    <span>Perfiles</span>
                  </button>
                  
                  <button
                    onClick={handleExportConfiguration}
                    disabled={count === 0}
                    className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 transition-all duration-200 ${
                      count > 0
                        ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <i className="fas fa-download text-sm"></i>
                    <span>Exportar</span>
                  </button>
                  
                  <button
                    onClick={handleGenerateScript}
                    disabled={count === 0}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center space-x-2
                      transition-all duration-200
                      ${count > 0
                        ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <i className="fas fa-code text-sm"></i>
                    <span>Generar Script</span>
                    {count > 0 && (
                      <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
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
          </div>
        </main>

        {/* Script Section */}
        {showScriptSection && (
          <div id="script-section">
            <ScriptSection
              selectedApps={getSelectedApps()}
              onClose={handleCloseScript}
              onToast={addToast}
            />
          </div>
        )}

        {/* Profile Manager Modal */}
        {showProfileManager && (
          <ProfileManager
            profiles={profiles}
            currentProfile={currentProfile}
            onClose={() => setShowProfileManager(false)}
            onLoadProfile={handleProfileLoad}
            onCreateProfile={handleProfileCreate}
            onDeleteProfile={handleProfileDelete}
            onUpdateCurrentProfile={updateCurrentProfile}
            onExport={handleExportConfiguration}
            onImport={handleImportConfigurationEvent}
            onShowToast={(message: string, type: 'success' | 'error') => {
              addToast({
                message,
                type,
                duration: 3000
              });
            }}
          />
        )}

        {/* Selected Apps Modal */}
        <SelectedAppsModal
          apps={getSelectedApps()}
          isOpen={showSelectedApps}
          onClose={() => setShowSelectedApps(false)}
          onRemoveApp={handleRemoveSelectedApp}
        />

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
