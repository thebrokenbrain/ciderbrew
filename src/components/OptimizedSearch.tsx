import React, { useState, useCallback } from 'react';
import type { SearchableApp } from '../types/api';
import { HybridSearchService } from '../services/HybridSearchService';
import { useDebounce } from '../hooks/useDebounce';

interface OptimizedSearchProps {
  onResults: (apps: SearchableApp[]) => void;
  onResultsUpdate?: (updater: (prev: SearchableApp[]) => SearchableApp[]) => void;
  onLoading: (loading: boolean) => void;
  placeholder?: string;
  className?: string;
}

const OptimizedSearch: React.FC<OptimizedSearchProps> = ({
  onResults,
  onLoading,
  placeholder = "Buscar aplicaciones...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [allResults, setAllResults] = useState<SearchableApp[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [searchSource, setSearchSource] = useState<'local' | 'api' | 'hybrid'>('local');
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedQuery = useDebounce(query, 500);

  // Memoizar la búsqueda para evitar re-renderizados
  React.useEffect(() => {
    const performSearch = async () => {
      setIsSearching(true);
      onLoading(true);
      
      try {
        const results = await HybridSearchService.search(debouncedQuery, 0);
        setHasMore(results.hasMore);
        setTotalResults(results.total);
        setCurrentPage(0);
        setAllResults(results.results);
        setSearchSource(results.source);
      } catch (error) {
        console.error('Error en búsqueda:', error);
        setAllResults([]);
        setHasMore(false);
        setTotalResults(0);
        setSearchSource('local');
      } finally {
        setIsSearching(false);
        onLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, onLoading]);

  // Actualizar resultados cuando cambien - Solo cuando realmente hay cambios
  React.useEffect(() => {
    console.log('🔍 OptimizedSearch - Actualizando resultados:', allResults.length);
    onResults(allResults);
  }, [allResults, onResults]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('⌨️ OptimizedSearch - Input change:', e.target.value);
    setQuery(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
    setCurrentPage(0);
    setAllResults([]);
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || isSearching) return;
    
    const nextPage = currentPage + 1;
    setIsSearching(true);
    onLoading(true);
    
    try {
      const results = await HybridSearchService.search(debouncedQuery, nextPage);
      setCurrentPage(nextPage);
      setHasMore(results.hasMore);
      
      // Agregar nuevos resultados a los existentes
      setAllResults(prev => [...prev, ...results.results]);
    } catch (error) {
      console.error('Error cargando más resultados:', error);
    } finally {
      setIsSearching(false);
      onLoading(false);
    }
  }, [debouncedQuery, currentPage, hasMore, isSearching, onLoading]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barra de búsqueda con indicador de carga */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <i className="fas fa-spinner fa-spin text-primary-500 text-sm"></i>
          ) : (
            <i className="fas fa-search text-primary-400"></i>
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-primary-200 rounded-xl 
                   focus:ring-2 focus:ring-primary-500 focus:border-transparent
                   bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500
                   transition-all duration-200 hover:bg-white/90
                   text-sm md:text-base"
        />
        {query && !isSearching && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center
                     text-gray-400 hover:text-gray-600 transition-colors duration-200"
            type="button"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="w-4 h-4">
              <div className="w-full h-full rounded-full border-2 border-primary-200"></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-transparent border-t-primary-500 animate-spin"></div>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas de búsqueda */}
      {totalResults > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span>
              {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-600">
              {searchSource === 'local' && '📦 Local'}
              {searchSource === 'api' && '🌐 Homebrew'}
              {searchSource === 'hybrid' && '🔄 Híbrido'}
            </span>
          </div>
          {hasMore && (
            <button
              onClick={loadMore}
              className="text-primary-500 hover:text-primary-600 underline"
            >
              Cargar más
            </button>
          )}
        </div>
      )}

      {/* Sugerencias de búsqueda */}
      {!query && (
        <div className="text-xs text-gray-500 flex flex-wrap gap-2">
          <span>Prueba:</span>
          {['code', 'chrome', 'slack', 'git', 'docker'].map(suggestion => (
            <button 
              key={suggestion}
              onClick={() => setQuery(suggestion)}
              className="text-primary-500 hover:text-primary-600 underline"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptimizedSearch;
