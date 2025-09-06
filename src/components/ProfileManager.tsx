import React, { useState } from 'react';
import type { AppProfile } from '../services/StorageService';

interface ProfileManagerProps {
  profiles: AppProfile[];
  currentProfile: AppProfile | null;
  onClose: () => void;
  onLoadProfile: (profileId: string) => void;
  onCreateProfile: (name: string) => void;
  onDeleteProfile: (profileId: string) => void;
  onUpdateCurrentProfile: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profiles,
  currentProfile,
  onClose,
  onLoadProfile,
  onCreateProfile,
  onDeleteProfile,
  onUpdateCurrentProfile,
  onExport,
  onImport,
  onShowToast
}) => {
  const [newProfileName, setNewProfileName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      onShowToast('El nombre del perfil es requerido', 'error');
      return;
    }

    if (profiles.some(p => p.name.toLowerCase() === newProfileName.toLowerCase())) {
      onShowToast('Ya existe un perfil con ese nombre', 'error');
      return;
    }

    onCreateProfile(newProfileName.trim());
    setNewProfileName('');
    setShowCreateForm(false);
  };

  const handleUpdateCurrentProfile = () => {
    if (currentProfile) {
      onUpdateCurrentProfile();
      onShowToast('Perfil actualizado con las aplicaciones seleccionadas', 'success');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <i className="fas fa-user-cog mr-3 text-primary-500"></i>
              Gestión de Perfiles
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Administra tus configuraciones de aplicaciones
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl transition-colors"
            title="Cerrar"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Storage Information Banner */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  Almacenamiento Local
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Los perfiles se guardan en el localStorage de tu navegador y no se pueden 
                  compartir entre distintos navegadores o dispositivos. Para compartir 
                  configuraciones, utiliza las opciones de exportar/importar.
                </p>
              </div>
            </div>
          </div>

          {/* Current Profile Section */}
          {currentProfile && (
            <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-primary-900 dark:text-primary-100 flex items-center">
                    <i className="fas fa-star mr-2 text-primary-500"></i>
                    Perfil Activo: {currentProfile.name}
                  </h3>
                  <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">
                    {currentProfile.apps.length} aplicaciones configuradas
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onLoadProfile(currentProfile.id)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    title="Aplicar las aplicaciones de este perfil a la selección actual"
                  >
                    <i className="fas fa-download"></i>
                    <span>Aplicar</span>
                  </button>
                  <button
                    onClick={handleUpdateCurrentProfile}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    title="Actualizar el perfil con las aplicaciones actualmente seleccionadas"
                  >
                    <i className="fas fa-sync-alt"></i>
                    <span>Actualizar</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Create Profile */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <i className="fas fa-plus-circle mr-2 text-green-500"></i>
                Crear Nuevo Perfil
              </h3>
              {!showCreateForm ? (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Crear perfil con selección actual
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Nombre del perfil..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateProfile()}
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCreateProfile}
                      className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Crear
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewProfileName('');
                      }}
                      className="flex-1 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Import/Export */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <i className="fas fa-exchange-alt mr-2 text-blue-500"></i>
                Importar/Exportar
              </h3>
              <div className="space-y-2">
                <button
                  onClick={onExport}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-download"></i>
                  <span>Exportar Configuración</span>
                </button>
                <label className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer">
                  <i className="fas fa-upload"></i>
                  <span>Importar Configuración</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={onImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Profiles List */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <i className="fas fa-list mr-2 text-purple-500"></i>
              Perfiles Guardados ({profiles.length})
            </h3>
            
            {profiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <i className="fas fa-folder-open text-4xl mb-3"></i>
                <p>No hay perfiles guardados</p>
                <p className="text-sm">Crea tu primer perfil con las aplicaciones seleccionadas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      currentProfile?.id === profile.id
                        ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                            {currentProfile?.id === profile.id && (
                              <i className="fas fa-star text-primary-500 mr-2"></i>
                            )}
                            {profile.name}
                          </h4>
                          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                            {profile.apps.length} apps
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Creado el {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {currentProfile?.id !== profile.id && (
                          <button
                            onClick={() => onLoadProfile(profile.id)}
                            className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded text-sm font-medium transition-colors"
                          >
                            Cargar
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Estás seguro de que quieres eliminar el perfil "${profile.name}"?`)) {
                              onDeleteProfile(profile.id);
                            }
                          }}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;
