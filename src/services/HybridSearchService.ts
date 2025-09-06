import type { SearchableApp } from '../types/api';
import { LocalSearchService } from './LocalSearchService';
import { ArchitectureDetectionService } from './ArchitectureDetectionService';

export class HybridSearchService {
  private static cache = new Map<string, SearchableApp[]>();
  private static combinedResultsCache = new Map<string, SearchableApp[]>();
  private static readonly PAGE_SIZE = 12;
  private static readonly API_BASE = 'https://formulae.brew.sh/api';
  
  /**
   * Búsqueda híbrida: local primero, luego API
   */
  static async search(query: string, page = 0): Promise<{ 
    results: SearchableApp[]; 
    total: number; 
    hasMore: boolean;
    source: 'local' | 'api' | 'hybrid';
  }> {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) {
      const featured = LocalSearchService.getFeatured(page);
      return { ...featured, source: 'local' as const };
    }

    // Clave para cache de resultados combinados
    const cacheKey = `combined_${normalizedQuery}`;
    
    // Si es la primera página, hacer búsqueda completa
    if (page === 0) {
      // 1. Buscar primero en la base de datos local
      const localResults = LocalSearchService.search(normalizedQuery, 0);
      
      // Si tenemos suficientes resultados locales, usarlos
      if (localResults.results.length >= 6) {
        const startIndex = page * this.PAGE_SIZE;
        const endIndex = startIndex + this.PAGE_SIZE;
        
        // Guardar todos los resultados locales en cache para páginas siguientes
        this.combinedResultsCache.set(cacheKey, localResults.results);
        
        return {
          results: localResults.results.slice(startIndex, endIndex),
          total: localResults.total,
          hasMore: endIndex < localResults.total,
          source: 'local' as const
        };
      }

      // 2. Si no hay suficientes resultados locales, buscar en API
      try {
        const apiResults = await this.searchHomebrew(normalizedQuery);
        
        // Combinar resultados: locales primero, luego API (sin duplicados)
        const localIds = new Set(localResults.results.map(app => app.id));
        const uniqueApiResults = apiResults.filter(app => !localIds.has(app.id));
        
        const combinedResults = [...localResults.results, ...uniqueApiResults];
        
        // Guardar todos los resultados combinados en cache
        this.combinedResultsCache.set(cacheKey, combinedResults);
        
        // Paginar la primera página
        const startIndex = page * this.PAGE_SIZE;
        const endIndex = startIndex + this.PAGE_SIZE;
        
        return {
          results: combinedResults.slice(startIndex, endIndex),
          total: combinedResults.length,
          hasMore: endIndex < combinedResults.length,
          source: combinedResults.length > localResults.results.length ? 'hybrid' as const : 'local' as const
        };
        
      } catch (error) {
        console.warn('Error en búsqueda API, usando solo resultados locales:', error);
        
        // Si falla la API, devolver solo resultados locales
        const startIndex = page * this.PAGE_SIZE;
        const endIndex = startIndex + this.PAGE_SIZE;
        
        // Guardar resultados locales en cache
        this.combinedResultsCache.set(cacheKey, localResults.results);
        
        return {
          results: localResults.results.slice(startIndex, endIndex),
          total: localResults.total,
          hasMore: endIndex < localResults.total,
          source: 'local' as const
        };
      }
    } else {
      // Para páginas siguientes, usar cache si existe
      const cachedResults = this.combinedResultsCache.get(cacheKey);
      
      if (cachedResults) {
        const startIndex = page * this.PAGE_SIZE;
        const endIndex = startIndex + this.PAGE_SIZE;
        
        return {
          results: cachedResults.slice(startIndex, endIndex),
          total: cachedResults.length,
          hasMore: endIndex < cachedResults.length,
          source: 'hybrid' as const
        };
      } else {
        // Si no hay cache, hacer búsqueda desde cero (fallback)
        return this.search(query, 0);
      }
    }
  }

  /**
   * Buscar en la API de Homebrew
   */
  private static async searchHomebrew(query: string): Promise<SearchableApp[]> {
    const cacheKey = `api-${query}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Buscar en formulae (CLI tools)
    const formulaePromise = fetch(`${this.API_BASE}/formula.json`)
      .then(res => res.ok ? res.json() : [])
      .catch(() => []);

    // Buscar en casks (GUI apps) 
    const casksPromise = fetch(`${this.API_BASE}/cask.json`)
      .then(res => res.ok ? res.json() : [])
      .catch(() => []);

    const [formulae, casks] = await Promise.all([formulaePromise, casksPromise]);

    const results: SearchableApp[] = [];
    const queryLower = query.toLowerCase();

    // Procesar formulae (CLI tools)
    if (Array.isArray(formulae)) {
      const matchingFormulae = formulae
        .filter((item: any) => {
          const name = item.name?.toLowerCase() || '';
          const desc = item.desc?.toLowerCase() || '';
          return name.includes(queryLower) || desc.includes(queryLower);
        })
        .slice(0, 20) // Limitar resultados
        .map((item: any) => this.formulaToSearchableApp(item));
      
      results.push(...matchingFormulae);
    }

    // Procesar casks (GUI apps)
    if (Array.isArray(casks)) {
      const matchingCasks = casks
        .filter((item: any) => {
          const name = item.name?.join(' ').toLowerCase() || '';
          const desc = item.desc?.toLowerCase() || '';
          return name.includes(queryLower) || desc.includes(queryLower);
        })
        .slice(0, 20) // Limitar resultados
        .map((item: any) => this.caskToSearchableApp(item));
      
      results.push(...matchingCasks);
    }

    // Ordenar por relevancia
    results.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(queryLower) ? 2 : 0;
      const bNameMatch = b.name.toLowerCase().includes(queryLower) ? 2 : 0;
      const aIdMatch = a.id.includes(queryLower) ? 1 : 0;
      const bIdMatch = b.id.includes(queryLower) ? 1 : 0;
      
      return (bNameMatch + bIdMatch) - (aNameMatch + aIdMatch);
    });

    // Limitar a los mejores 30 resultados
    const limitedResults = results.slice(0, 30);
    this.cache.set(cacheKey, limitedResults);
    
    return limitedResults;
  }

  /**
   * Convertir formula de Homebrew a SearchableApp
   */
  private static formulaToSearchableApp(formula: any): SearchableApp {
    const app: SearchableApp = {
      id: formula.name,
      name: formula.name,
      description: formula.desc || 'Herramienta de línea de comandos',
      homepage: formula.homepage || '',
      version: formula.versions?.stable || 'latest',
      installType: 'brew',
      command: `brew install ${formula.name}`,
      category: this.guessCategory(formula.name, formula.desc || ''),
      source: 'homebrew',
      deprecated: formula.deprecated || false
    };

    // Add architecture support information
    const architectureSupport = ArchitectureDetectionService.getArchitectureSupport(
      formula.name, 
      formula.name, 
      'brew'
    );
    if (architectureSupport) {
      app.architecture = architectureSupport;
    }

    return app;
  }

  /**
   * Convertir cask de Homebrew a SearchableApp
   */
  private static caskToSearchableApp(cask: any): SearchableApp {
    const name = Array.isArray(cask.name) ? cask.name[0] : cask.name;
    const app: SearchableApp = {
      id: cask.token,
      name: name || cask.token,
      description: cask.desc || 'Aplicación para macOS',
      homepage: cask.homepage || '',
      version: cask.version || 'latest',
      installType: 'brew-cask',
      command: `brew install --cask ${cask.token}`,
      category: this.guessCategory(name || cask.token, cask.desc || ''),
      source: 'homebrew',
      deprecated: cask.deprecated || false
    };

    // Add architecture support information
    const architectureSupport = ArchitectureDetectionService.getArchitectureSupport(
      cask.token, 
      name || cask.token, 
      'brew-cask'
    );
    if (architectureSupport) {
      app.architecture = architectureSupport;
    }

    return app;
  }

  /**
   * Intentar determinar la categoría basada en el nombre y descripción
   */
  private static guessCategory(name: string, description: string): string {
    const text = `${name} ${description}`.toLowerCase();
    
    if (text.includes('browser') || text.includes('chrome') || text.includes('firefox')) return 'Browsers';
    if (text.includes('code') || text.includes('development') || text.includes('git') || text.includes('editor')) return 'Development';
    if (text.includes('music') || text.includes('video') || text.includes('media') || text.includes('player')) return 'Media';
    if (text.includes('chat') || text.includes('message') || text.includes('communication') || text.includes('slack')) return 'Communication';
    if (text.includes('design') || text.includes('graphics') || text.includes('photo') || text.includes('image')) return 'Design';
    if (text.includes('security') || text.includes('password') || text.includes('vpn') || text.includes('firewall')) return 'Security';
    if (text.includes('game') || text.includes('gaming') || text.includes('steam')) return 'Games';
    if (text.includes('database') || text.includes('sql') || text.includes('mongo')) return 'Database';
    if (text.includes('terminal') || text.includes('shell') || text.includes('command')) return 'Terminal';
    
    return 'Utilities';
  }

  /**
   * Limpiar cache
   */
  static clearCache(): void {
    this.cache.clear();
    this.combinedResultsCache.clear();
    LocalSearchService.clearCache();
  }
}

export default HybridSearchService;
