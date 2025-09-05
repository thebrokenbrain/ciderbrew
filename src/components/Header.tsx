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
        {/* Main Title Section with Icon and Text */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4">
          {/* Custom PNG Icon - Left Side */}
          <img 
            src={iconImage} 
            alt="macOS Setup Assistant" 
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52 object-contain"
          />
          
          {/* Title with Cider Bottle - Right Side */}
          <div className="flex items-center gap-3 sm:gap-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light">
              macOS Setup Assistant
            </h1>
            <i className="fa fa-wine-bottle text-primary-400 text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"></i>
          </div>
        </div>
        <p className="text-base sm:text-lg md:text-xl opacity-90 mb-2 sm:mb-3 px-4">
          Genera tu script personalizado de instalación para macOS
        </p>
        <p className="text-xs sm:text-sm md:text-base text-primary-300 opacity-70 mb-3 sm:mb-4 px-4">
          Pure vibe coding ❤️
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
