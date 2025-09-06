/**
 * Componente de filtros avanzados
 */

import type { FilterOptions } from '../types';

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function AdvancedFilters({ filters, onFiltersChange }: AdvancedFiltersProps) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Install Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de instalación
          </label>
          <select
            value={filters.installType?.[0] || 'all'}
            onChange={(e) => onFiltersChange({ 
              ...filters, 
              installType: e.target.value === 'all' ? [] : [e.target.value]
            })}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Todos</option>
            <option value="brew-cask">Cask</option>
            <option value="brew">Brew</option>
            <option value="mas">Mac App Store</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        {/* Architecture Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Arquitectura
          </label>
          <select
            value={filters.architecture?.[0] || 'all'}
            onChange={(e) => onFiltersChange({ 
              ...filters, 
              architecture: e.target.value === 'all' ? [] : [e.target.value as 'arm64' | 'intel']
            })}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Todas</option>
            <option value="arm64">ARM64 (Apple Silicon)</option>
            <option value="intel">Intel</option>
          </select>
        </div>

        {/* Size Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mostrar solo
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.showOnlySelected || false}
                onChange={(e) => onFiltersChange({ ...filters, showOnlySelected: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Apps seleccionadas</span>
            </label>
          </div>
        </div>

        {/* Reset */}
        <div className="flex items-end">
          <button
            onClick={() => onFiltersChange({
              category: [],
              installType: [],
              architecture: [],
              source: [],
              sortBy: 'name',
              sortOrder: 'asc',
              showOnlySelected: false
            })}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
