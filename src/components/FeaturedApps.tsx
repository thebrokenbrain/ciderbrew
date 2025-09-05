import React, { useState, useEffect } from 'react';
import type { SearchableApp } from '../types/api';
import BrewApiService from '../services/BrewApiService';
import AppCard from './AppCard';

interface FeaturedAppsProps {
  onAppSelect: (app: SearchableApp, isSelected: boolean) => void;
  selectedApps: Set<string>;
  className?: string;
}

const FeaturedApps: React.FC<FeaturedAppsProps> = ({
  onAppSelect,
  selectedApps,
  className = ""
}) => {
  const [featuredApps, setFeaturedApps] = useState<SearchableApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedApps = async () => {
      try {
        setLoading(true);
        setError(null);
        const apps = await BrewApiService.getFeaturedPackages();
        setFeaturedApps(apps);
      } catch (err) {
        console.error('Error loading featured apps:', err);
        setError('Error al cargar aplicaciones destacadas');
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedApps();
  }, []);

  if (loading) {
    return (
      <div className={`${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <i className="fas fa-star text-yellow-500 mr-2"></i>
          Aplicaciones Populares
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-primary-100
                       animate-pulse"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-lg mb-3 mx-auto"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <i className="fas fa-exclamation-triangle text-red-500 mb-2"></i>
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-red-600 hover:text-red-800 underline text-xs"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (featuredApps.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-search text-3xl mb-3"></i>
          <p>No se encontraron aplicaciones destacadas</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        <i className="fas fa-star text-yellow-500 mr-2"></i>
        Aplicaciones Populares
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {featuredApps.map((app) => (
          <AppCard
            key={app.id}
            app={{
              ...app,
              isSelected: selectedApps.has(app.id)
            }}
            onSelect={(isSelected: boolean) => onAppSelect(app, isSelected)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedApps;
