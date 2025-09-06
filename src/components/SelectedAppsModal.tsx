import React from 'react';
import type { SearchableApp } from '../types/api';

interface SelectedAppsModalProps {
  apps: SearchableApp[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveApp: (appId: string) => void;
}

const SelectedAppsModal: React.FC<SelectedAppsModalProps> = ({
  apps,
  isOpen,
  onClose,
  onRemoveApp
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            <i className="fas fa-list mr-2 text-primary-500"></i>
            Aplicaciones Seleccionadas ({apps.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6">
          {apps.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-inbox text-4xl mb-4"></i>
              <p>No hay aplicaciones seleccionadas</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <i className={`${app.icon || 'fas fa-cube'} text-primary-600`}></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{app.name}</h3>
                      <p className="text-sm text-gray-500">{app.description}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {app.installType}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {app.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveApp(app.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar aplicación"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedAppsModal;
