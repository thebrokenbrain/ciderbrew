import type { AppCategory, FilterOptions } from '../types';
import { appConfig } from '../data/apps';
import { AdvancedFilters } from './AdvancedFilters';
import { useState } from 'react';

interface TabNavigationProps {
  activeCategory: AppCategory;
  onCategoryChange: (category: AppCategory) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  selectedCount: number;
  totalApps: number;
  onGenerateScript?: () => void;
  hasSelections?: boolean;
  showScriptSection?: boolean;
  onFiltersChange?: (filters: FilterOptions) => void;
  filters?: FilterOptions;
  onShowSelectedApps?: () => void;
}

export const TabNavigation = ({ 
  activeCategory, 
  onCategoryChange,
  onSelectAll,
  onDeselectAll,
  selectedCount,
  totalApps,
  onGenerateScript,
  hasSelections = false,
  showScriptSection = false,
  onFiltersChange,
  filters,
  onShowSelectedApps
}: TabNavigationProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const categories = Object.entries(appConfig.categories) as [AppCategory, typeof appConfig.categories[AppCategory]][];

  const handleFiltersChange = (newFilters: FilterOptions) => {
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  return (
    <div className="bg-secondary-50 dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Top Row: Counter and Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
          {/* Counter Badge */}
          <div className="flex items-center justify-center sm:justify-start">
            <button
              onClick={onShowSelectedApps}
              disabled={selectedCount === 0}
              className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
              title={selectedCount > 0 ? "Ver aplicaciones seleccionadas" : "No hay aplicaciones seleccionadas"}
            >
              <i className="fa fa-check-circle"></i>
              <span className="whitespace-nowrap">{selectedCount} de {totalApps} seleccionadas</span>
              {selectedCount > 0 && (
                <i className="fas fa-external-link-alt ml-1 text-xs"></i>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`
                w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2
                ${showAdvancedFilters
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 border border-secondary-300 dark:border-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-600'
                }
              `}
            >
              <i className={`fa ${showAdvancedFilters ? 'fa-filter-circle-xmark' : 'fa-filter'}`}></i>
              <span>Filtros</span>
              <i className={`fa fa-chevron-${showAdvancedFilters ? 'up' : 'down'} text-xs`}></i>
            </button>

            {!showScriptSection && onGenerateScript && (
              <>
                <button
                  onClick={onGenerateScript}
                  disabled={!hasSelections}
                  className={`
                    w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2
                    ${hasSelections
                      ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg'
                      : 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
                    }
                  `}
                >
                  <i className="fa fa-magic"></i>
                  Generar Script
                </button>
                
                {/* Separator - only on desktop */}
                <div className="hidden sm:block w-px bg-secondary-300 dark:bg-secondary-600 mx-2"></div>
              </>
            )}
            
            <button
              onClick={onSelectAll}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-success-500 text-white rounded-lg hover:bg-success-600 transition-colors duration-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
            >
              <i className="fa fa-check-double"></i>
              <span className="hidden sm:inline">Seleccionar Todo</span>
              <span className="sm:hidden">Seleccionar</span>
            </button>
            <button
              onClick={onDeselectAll}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition-colors duration-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
            >
              <i className="fa fa-times"></i>
              <span className="hidden sm:inline">Deseleccionar Todo</span>
              <span className="sm:hidden">Deseleccionar</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters Section */}
        {showAdvancedFilters && (
          <div className="mb-6 p-4 bg-white dark:bg-secondary-700 rounded-lg border border-secondary-200 dark:border-secondary-600 shadow-sm">
            <AdvancedFilters
              filters={filters || {
                category: [],
                installType: [],
                architecture: [],
                source: [],
                sortBy: 'name',
                sortOrder: 'asc',
                showOnlySelected: false
              }}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        )}

        {/* Bottom Row: Category Navigation */}
        <nav className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 justify-center">
          {categories.map(([key, category]) => (
            <button
              key={key}
              onClick={() => onCategoryChange(key)}
              className={`
                flex flex-col items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-300
                min-w-[80px] sm:min-w-[120px] text-xs sm:text-sm font-medium
                ${activeCategory === key 
                  ? 'bg-primary-500 text-white shadow-lg' 
                  : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-800 dark:hover:text-secondary-200'
                }
              `}
            >
              <i className={`fa ${category.icon} text-lg sm:text-xl`}></i>
              <span className="text-center leading-tight">{category.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
