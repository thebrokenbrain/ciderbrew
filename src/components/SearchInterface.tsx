import React, { useState, useCallback, useMemo } from 'react';
import type { SearchableApp } from '../types/api';
import OptimizedSearch from './OptimizedSearch';
import AppCard from './AppCard';
import SkeletonLoader from './SkeletonLoader';

interface SearchInterfaceProps {
  onAppSelect: (app: SearchableApp, isSelected: boolean) => void;
  selectedApps: Set<string>;
  className?: string;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onAppSelect,
  selectedApps,
  className = ""
}) => {
  const [searchResults, setSearchResults] = useState<SearchableApp[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Memoizar la función onResults para evitar re-renderizados innecesarios
  const handleSearchResults = useCallback((results: SearchableApp[]) => {
    setSearchResults(results);
  }, []);

  // Memoizar las aplicaciones con estado de selección para evitar recálculos
  const appsWithSelection = useMemo(() => {
    return searchResults.map(app => ({
      ...app,
      isSelected: selectedApps.has(app.id)
    }));
  }, [searchResults, selectedApps]);

  // Manejar selección de aplicación con debounce para evitar múltiples llamadas
  const handleAppSelect = useCallback((app: SearchableApp, isSelected: boolean) => {
    console.log('🔍 SearchInterface - Seleccionando app:', app.name, 'isSelected:', isSelected);
    
    // Crear una copia del app para evitar mutación directa
    const appToSelect = { ...app, isSelected };
    onAppSelect(appToSelect, isSelected);
  }, [onAppSelect]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Búsqueda */}
      <OptimizedSearch
        onResults={handleSearchResults}
        onLoading={setIsLoading}
        placeholder="Buscar aplicaciones (ej: chrome, code, slack)..."
        className="sticky top-4 z-10"
      />

      {/* Indicador de carga */}
      {isLoading && (
        <SkeletonLoader count={8} />
      )}

      {/* Resultados */}
      {!isLoading && appsWithSelection.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <i className="fas fa-th-large mr-2 text-primary-500"></i>
            Resultados ({appsWithSelection.length})
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {appsWithSelection.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onSelect={(isSelected) => handleAppSelect(app, isSelected)}
                className="transform transition-all duration-200 hover:scale-105"
              />
            ))}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {!isLoading && searchResults.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Busca aplicaciones para macOS
          </h3>
          <p className="text-gray-500 text-sm">
            Usa el buscador para encontrar las aplicaciones que necesitas
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;
