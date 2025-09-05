import type { AppCategory } from '../types';
import { appConfig } from '../data/apps';

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
  showScriptSection = false
}: TabNavigationProps) => {
  const categories = Object.entries(appConfig.categories) as [AppCategory, typeof appConfig.categories[AppCategory]][];

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Top Row: Counter and Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
          {/* Counter Badge */}
          <div className="flex items-center justify-center sm:justify-start">
            <div className="bg-primary-500 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2">
              <i className="fa fa-check-circle"></i>
              <span className="whitespace-nowrap">{selectedCount} de {totalApps} seleccionadas</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            {!showScriptSection && onGenerateScript && (
              <>
                <button
                  onClick={onGenerateScript}
                  disabled={!hasSelections}
                  className={`
                    w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2
                    ${hasSelections
                      ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  <i className="fa fa-magic"></i>
                  Generar Script
                </button>
                
                {/* Separator - only on desktop */}
                <div className="hidden sm:block w-px bg-gray-300 mx-2"></div>
              </>
            )}
            
            <button
              onClick={onSelectAll}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
            >
              <i className="fa fa-check-double"></i>
              <span className="hidden sm:inline">Seleccionar Todo</span>
              <span className="sm:hidden">Seleccionar</span>
            </button>
            <button
              onClick={onDeselectAll}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
            >
              <i className="fa fa-times"></i>
              <span className="hidden sm:inline">Deseleccionar Todo</span>
              <span className="sm:hidden">Deseleccionar</span>
            </button>
          </div>
        </div>

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
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
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
