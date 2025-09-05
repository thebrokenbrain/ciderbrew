import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 8, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

const SkeletonCard: React.FC = () => {
  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-3 border-2 border-primary-100 animate-pulse">
      {/* Selection indicator placeholder */}
      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-200"></div>
      
      {/* App icon placeholder */}
      <div className="flex justify-center mb-2">
        <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
      </div>
      
      {/* App name placeholder */}
      <div className="h-4 bg-gray-200 rounded mb-1 mx-2"></div>
      
      {/* Install type badge placeholder */}
      <div className="flex justify-center mb-2">
        <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
      </div>
      
      {/* Description placeholder */}
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded mx-1"></div>
        <div className="h-3 bg-gray-200 rounded mx-3"></div>
      </div>
      
      {/* Version placeholder */}
      <div className="mt-2 flex justify-center">
        <div className="h-3 w-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
