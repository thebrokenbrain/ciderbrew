import type { App } from '../types';

interface AppCardProps {
  app: App;
  isSelected: boolean;
  onToggle: (appId: string, isSelected: boolean) => void;
}

const AppCard = ({ app, isSelected, onToggle }: AppCardProps) => {
  const handleClick = () => {
    if (!app.isRequired) {
      onToggle(app.id, !isSelected);
    }
  };

  const getInstallTypeBadge = () => {
    const badgeClasses = "text-xs px-2 py-1 rounded-full font-medium";
    
    switch (app.installType) {
      case 'brew':
        return <span className={`${badgeClasses} bg-primary-100 text-primary-800`}>brew</span>;
      case 'brew-cask':
        return <span className={`${badgeClasses} bg-green-100 text-green-800`}>brew cask</span>;
      case 'curl-script':
        return <span className={`${badgeClasses} bg-orange-100 text-orange-800`}>curl script</span>;
      case 'xcode-select':
        return <span className={`${badgeClasses} bg-purple-100 text-purple-800`}>xcode-select</span>;
      case 'mas':
        return <span className={`${badgeClasses} bg-pink-100 text-pink-800`}>mas</span>;
      default:
        return <span className={`${badgeClasses} bg-gray-100 text-gray-800`}>custom</span>;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative p-4 sm:p-6 rounded-2xl transition-all duration-300 cursor-pointer border-2
        ${app.isSpecial 
          ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200' 
          : 'bg-gray-50 border-gray-200'
        }
        ${isSelected 
          ? app.isSpecial 
            ? 'border-amber-400 shadow-lg transform -translate-y-1' 
            : 'border-primary-400 bg-primary-50 shadow-lg transform -translate-y-1'
          : 'hover:border-primary-300 hover:shadow-md hover:transform hover:-translate-y-0.5'
        }
        ${app.isRequired ? 'opacity-75' : ''}
      `}
    >
      {/* App Icon */}
      <div className={`
        w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl text-white mb-3 sm:mb-4
        ${app.isSpecial ? 'bg-orange-500' : 'bg-primary-500'}
      `}>
        <i className={`fa ${app.icon}`}></i>
      </div>

      {/* App Info */}
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
          {app.name}
          {app.isRequired && (
            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              Requerido
            </span>
          )}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
          {app.description}
        </p>
        {getInstallTypeBadge()}
      </div>

      {/* Checkbox */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
        <div className="relative">
          <input
            type="checkbox"
            checked={isSelected}
            disabled={app.isRequired}
            onChange={() => {}} // Controlled by parent click
            className="sr-only"
          />
          <div className={`
            w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200
            ${isSelected 
              ? app.isSpecial 
                ? 'bg-orange-500 border-orange-500' 
                : 'bg-primary-500 border-primary-500'
              : 'border-gray-300 bg-white'
            }
            ${app.isRequired ? 'opacity-50' : 'hover:border-primary-400'}
          `}>
            {isSelected && (
              <i className="fa fa-check text-white text-xs"></i>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AppGridProps {
  apps: App[];
  selectedApps: Set<string>;
  onToggleApp: (appId: string, isSelected: boolean) => void;
}

export const AppGrid = ({ apps, selectedApps, onToggleApp }: AppGridProps) => {
  const selectedInCategory = apps.filter(app => selectedApps.has(app.id)).length;
  const totalInCategory = apps.length;

  if (apps.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fa fa-box-open text-4xl text-gray-400 mb-4"></i>
        <p className="text-gray-500">No hay aplicaciones en esta categoría.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Category Stats */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Aplicaciones en esta categoría
          </h2>
          <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
            {selectedInCategory} de {totalInCategory} seleccionadas
          </div>
        </div>
        
        {selectedInCategory > 0 && (
          <div className="flex items-center gap-2 text-green-600">
            <i className="fa fa-check-circle"></i>
            <span className="text-sm font-medium">
              {Math.round((selectedInCategory / totalInCategory) * 100)}% completado
            </span>
          </div>
        )}
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {apps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            isSelected={selectedApps.has(app.id)}
            onToggle={onToggleApp}
          />
        ))}
      </div>
    </div>
  );
};
