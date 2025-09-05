import iconImage from '../assets/icon.png';

interface HeaderProps {
  selectedCount?: number;
  totalApps?: number;
}

export const Header = ({ selectedCount = 0, totalApps = 0 }: HeaderProps) => {
  const hasSelections = selectedCount > 1; // More than just homebrew
  
  return (
    <header className="text-center mb-8 sm:mb-10 bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-white/20">
      <div className="text-white">
        <div className="flex justify-center mb-3 sm:mb-4">
          <img 
            src={iconImage} 
            alt="macOS Setup Assistant" 
            className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-light mb-3 sm:mb-4">
          macOS Setup Assistant
        </h1>
        <p className="text-base sm:text-lg md:text-xl opacity-90 mb-3 sm:mb-4 px-4">
          Genera tu script personalizado de instalación para macOS
        </p>
        
        {/* Selection Summary */}
        {hasSelections && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-white/30">
            <i className="fa fa-check-circle text-green-300"></i>
            <span className="font-medium text-sm sm:text-base">
              {selectedCount} app{selectedCount !== 1 ? 's' : ''} listas
            </span>
          </div>
        )}
        
        {!hasSelections && totalApps > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <i className="fa fa-info-circle text-primary-300"></i>
            <span className="opacity-90">
              {totalApps} aplicaciones disponibles para seleccionar
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
