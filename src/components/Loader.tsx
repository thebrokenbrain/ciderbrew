import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  message = 'Cargando...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const containerSizeClasses = {
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizeClasses[size]} ${className}`}>
      {/* Spinner */}
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin`}>
          <div className="h-full w-full rounded-full border-2 border-primary-200"></div>
          <div className="absolute top-0 left-0 h-full w-full rounded-full border-2 border-transparent border-t-primary-500 animate-spin"></div>
        </div>
      </div>
      
      {/* Message */}
      {message && (
        <p className={`mt-2 text-gray-600 ${
          size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
