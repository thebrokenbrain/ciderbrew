import React, { useState, useCallback, useEffect } from 'react';
import type { SearchableApp } from '../types/api';
import BrewApiService from '../services/BrewApiService';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  onResults: (apps: SearchableApp[]) => void;
  onLoading: (loading: boolean) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onResults,
  onLoading,
  placeholder = "Buscar aplicaciones en Homebrew...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      onResults([]);
      return;
    }

    setIsSearching(true);
    onLoading(true);

    try {
      const searchResult = await BrewApiService.searchPackages(searchQuery, 50);
      const apps = BrewApiService.convertToSearchableApps(searchResult);
      onResults(apps);
    } catch (error) {
      console.error('Search error:', error);
      onResults([]);
    } finally {
      setIsSearching(false);
      onLoading(false);
    }
  }, [onResults, onLoading]);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    onResults([]);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i className={`fas ${isSearching ? 'fa-spinner fa-spin' : 'fa-search'} text-primary-400`}></i>
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
          disabled={isSearching}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center
                     text-gray-400 hover:text-gray-600 transition-colors duration-200"
            type="button"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      
      {/* Search hints */}
      {!query && (
                <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-2">
          <span>Ejemplos:</span>
          <button 
            onClick={() => setQuery('code')}
            className="text-primary-500 hover:text-primary-600 underline"
          >
            code
          </button>
          <button 
            onClick={() => setQuery('chrome')}
            className="text-primary-500 hover:text-primary-600 underline"
          >
            chrome
          </button>
          <button 
            onClick={() => setQuery('docker')}
            className="text-primary-500 hover:text-primary-600 underline"
          >
            docker
          </button>
          <button 
            onClick={() => setQuery('slack')}
            className="text-primary-500 hover:text-primary-600 underline"
          >
            slack
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
