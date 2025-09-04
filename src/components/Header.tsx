interface HeaderProps {
  selectedCount?: number;
  totalApps?: number;
}

export const Header = ({ selectedCount = 0, totalApps = 0 }: HeaderProps) => {
  const hasSelections = selectedCount > 1; // More than just homebrew
  
  return (
    <header className="text-center mb-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
      <div className="text-white">
        <div className="text-6xl mb-4">
          <i className="fab fa-apple"></i>
        </div>
        <h1 className="text-4xl md:text-5xl font-light mb-4">
          macOS Setup Assistant
        </h1>
        <p className="text-lg md:text-xl opacity-90 mb-4">
          Genera tu script personalizado de instalación para macOS
        </p>
        
        {/* Selection Summary */}
        {hasSelections && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
            <i className="fa fa-check-circle text-green-300"></i>
            <span className="font-medium">
              {selectedCount} aplicaciones listas para instalar
            </span>
          </div>
        )}
        
        {!hasSelections && totalApps > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <i className="fa fa-info-circle text-blue-300"></i>
            <span className="opacity-90">
              {totalApps} aplicaciones disponibles para seleccionar
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
