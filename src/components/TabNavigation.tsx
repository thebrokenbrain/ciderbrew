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
      <div className="flex flex-wrap justify-between items-center px-8 py-4">
        {/* Counter Badge */}
        <div className="flex items-center gap-4 mb-4 lg:mb-0">
          <div className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            <i className="fa fa-check-circle"></i>
            <span>{selectedCount} de {totalApps} seleccionadas</span>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2">
          {categories.map(([key, category]) => (
            <button
              key={key}
              onClick={() => onCategoryChange(key)}
              className={`
                flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300
                min-w-[120px] text-sm font-medium
                ${activeCategory === key 
                  ? 'bg-primary-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }
              `}
            >
              <i className={`fa ${category.icon} text-xl`}></i>
              <span>{category.name}</span>
            </button>
          ))}
        </nav>
        
        <div className="flex gap-2 mt-4 lg:mt-0">
          {!showScriptSection && onGenerateScript && (
            <button
              onClick={onGenerateScript}
              disabled={!hasSelections}
              className={`
                px-6 py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2
                ${hasSelections
                  ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <i className="fa fa-magic"></i>
              Generar Script
            </button>
          )}
          
          <button
            onClick={onSelectAll}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
          >
            <i className="fa fa-check-double"></i>
            Seleccionar Todo
          </button>
          <button
            onClick={onDeselectAll}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
          >
            <i className="fa fa-times"></i>
            Deseleccionar Todo
          </button>
        </div>
      </div>
    </div>
  );
};
