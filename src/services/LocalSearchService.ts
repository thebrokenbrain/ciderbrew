import type { SearchableApp } from '../types/api';
import { ArchitectureDetectionService } from './ArchitectureDetectionService';

// Base de datos local estática para evitar problemas de API
const LOCAL_PACKAGES: SearchableApp[] = [
  // Development Tools - CLI
  { id: 'git', name: 'Git', description: 'Sistema de control de versiones distribuido', homepage: 'https://git-scm.com', version: 'latest', installType: 'brew', command: 'brew install git', category: 'Development', source: 'homebrew' },
  { id: 'node', name: 'Node.js', description: 'Runtime de JavaScript', homepage: 'https://nodejs.org', version: 'latest', installType: 'brew', command: 'brew install node', category: 'Development', source: 'homebrew' },
  { id: 'python', name: 'Python', description: 'Lenguaje de programación interpretado', homepage: 'https://python.org', version: 'latest', installType: 'brew', command: 'brew install python', category: 'Development', source: 'homebrew' },
  { id: 'yarn', name: 'Yarn', description: 'Gestor de paquetes para JavaScript', homepage: 'https://yarnpkg.com', version: 'latest', installType: 'brew', command: 'brew install yarn', category: 'Development', source: 'homebrew' },
  { id: 'wget', name: 'wget', description: 'Herramienta para descargar archivos', homepage: 'https://www.gnu.org/software/wget/', version: 'latest', installType: 'brew', command: 'brew install wget', category: 'Utilities', source: 'homebrew' },
  { id: 'curl', name: 'curl', description: 'Herramienta para transferir datos', homepage: 'https://curl.se', version: 'latest', installType: 'brew', command: 'brew install curl', category: 'Utilities', source: 'homebrew' },

  // Development Tools - Apps
  { id: 'vscode', name: 'Visual Studio Code', description: 'Editor de código fuente', homepage: 'https://code.visualstudio.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask visual-studio-code', category: 'Development', source: 'homebrew', architecture: { arm64: true, intel: true } },
  { id: 'docker', name: 'Docker Desktop', description: 'Plataforma de contenedores', homepage: 'https://docker.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask docker', category: 'Development', source: 'homebrew', architecture: { arm64: true, intel: true } },
  { id: 'postman', name: 'Postman', description: 'Plataforma para desarrollo de APIs', homepage: 'https://postman.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask postman', category: 'Development', source: 'homebrew', architecture: { arm64: true, intel: true } },
  { id: 'github-desktop', name: 'GitHub Desktop', description: 'Cliente de Git con interfaz gráfica', homepage: 'https://desktop.github.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask github', category: 'Development', source: 'homebrew', architecture: { arm64: true, intel: true } },
  { id: 'sourcetree', name: 'Sourcetree', description: 'Cliente Git visual', homepage: 'https://sourcetreeapp.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask sourcetree', category: 'Development', source: 'homebrew', architecture: { arm64: false, intel: true } },

  // Browsers
  { id: 'chrome', name: 'Google Chrome', description: 'Navegador web de Google', homepage: 'https://chrome.google.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask google-chrome', category: 'Browsers', source: 'homebrew', architecture: { arm64: true, intel: true } },
  { id: 'firefox', name: 'Mozilla Firefox', description: 'Navegador web de Mozilla', homepage: 'https://firefox.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask firefox', category: 'Browsers', source: 'homebrew', architecture: { arm64: true, intel: true } },
  { id: 'safari', name: 'Safari Technology Preview', description: 'Versión preview de Safari', homepage: 'https://developer.apple.com/safari/', version: 'latest', installType: 'brew-cask', command: 'brew install --cask safari-technology-preview', category: 'Browsers', source: 'homebrew', architecture: { arm64: true, intel: true } },
  { id: 'edge', name: 'Microsoft Edge', description: 'Navegador web de Microsoft', homepage: 'https://microsoft.com/edge', version: 'latest', installType: 'brew-cask', command: 'brew install --cask microsoft-edge', category: 'Browsers', source: 'homebrew', architecture: { arm64: true, intel: true } },

  // Communication
  { id: 'slack', name: 'Slack', description: 'Plataforma de comunicación empresarial', homepage: 'https://slack.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask slack', category: 'Communication', source: 'homebrew', architecture: { arm64: true, intel: true } },
  { id: 'discord', name: 'Discord', description: 'Plataforma de chat y voz', homepage: 'https://discord.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask discord', category: 'Communication', source: 'homebrew', architecture: { arm64: true, intel: true } },
  { id: 'telegram', name: 'Telegram', description: 'Aplicación de mensajería', homepage: 'https://telegram.org', version: 'latest', installType: 'brew-cask', command: 'brew install --cask telegram', category: 'Communication', source: 'homebrew', architecture: { arm64: true, intel: true } },
  { id: 'zoom', name: 'Zoom', description: 'Plataforma de videoconferencias', homepage: 'https://zoom.us', version: 'latest', installType: 'brew-cask', command: 'brew install --cask zoom', category: 'Communication', source: 'homebrew', architecture: { arm64: true, intel: true } },
  { id: 'teams', name: 'Microsoft Teams', description: 'Plataforma de colaboración', homepage: 'https://teams.microsoft.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask microsoft-teams', category: 'Communication', source: 'homebrew', architecture: { arm64: true, intel: true } },
  { id: 'skype', name: 'Skype', description: 'Servicio de videollamadas', homepage: 'https://skype.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask skype', category: 'Communication', source: 'homebrew', architecture: { arm64: true, intel: true } },

  // Media
  { id: 'spotify', name: 'Spotify', description: 'Servicio de streaming de música', homepage: 'https://spotify.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask spotify', category: 'Media', source: 'homebrew' },
  { id: 'vlc', name: 'VLC Media Player', description: 'Reproductor multimedia', homepage: 'https://videolan.org', version: 'latest', installType: 'brew-cask', command: 'brew install --cask vlc', category: 'Media', source: 'homebrew' },
  { id: 'itunes', name: 'iTunes', description: 'Reproductor multimedia de Apple', homepage: 'https://apple.com/itunes', version: 'latest', installType: 'brew-cask', command: 'brew install --cask itunes', category: 'Media', source: 'homebrew' },
  { id: 'plex', name: 'Plex', description: 'Servidor multimedia', homepage: 'https://plex.tv', version: 'latest', installType: 'brew-cask', command: 'brew install --cask plex', category: 'Media', source: 'homebrew' },

  // Design
  { id: 'figma', name: 'Figma', description: 'Herramienta de diseño colaborativo', homepage: 'https://figma.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask figma', category: 'Design', source: 'homebrew' },
  { id: 'sketch', name: 'Sketch', description: 'Herramienta de diseño vectorial', homepage: 'https://sketch.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask sketch', category: 'Design', source: 'homebrew' },
  { id: 'adobe-creative-cloud', name: 'Adobe Creative Cloud', description: 'Suite de aplicaciones creativas', homepage: 'https://adobe.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask adobe-creative-cloud', category: 'Design', source: 'homebrew' },

  // Utilities
  { id: 'rectangle', name: 'Rectangle', description: 'Gestor de ventanas', homepage: 'https://rectangleapp.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask rectangle', category: 'Utilities', source: 'homebrew' },
  { id: 'alfred', name: 'Alfred', description: 'Lanzador de aplicaciones y productividad', homepage: 'https://alfredapp.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask alfred', category: 'Utilities', source: 'homebrew' },
  { id: 'cleanmymac', name: 'CleanMyMac X', description: 'Herramienta de limpieza del sistema', homepage: 'https://cleanmymac.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask cleanmymac', category: 'Utilities', source: 'homebrew' },
  { id: 'appcleaner', name: 'AppCleaner', description: 'Desinstalador de aplicaciones', homepage: 'https://freemacsoft.net/appcleaner/', version: 'latest', installType: 'brew-cask', command: 'brew install --cask appcleaner', category: 'Utilities', source: 'homebrew' },

  // Security
  { id: '1password', name: '1Password', description: 'Gestor de contraseñas', homepage: 'https://1password.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask 1password', category: 'Security', source: 'homebrew' },
  { id: 'lastpass', name: 'LastPass', description: 'Gestor de contraseñas', homepage: 'https://lastpass.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask lastpass', category: 'Security', source: 'homebrew' },
  { id: 'malwarebytes', name: 'Malwarebytes', description: 'Protección contra malware', homepage: 'https://malwarebytes.com', version: 'latest', installType: 'brew-cask', command: 'brew install --cask malwarebytes', category: 'Security', source: 'homebrew' }
];

export class LocalSearchService {
  private static cache = new Map<string, SearchableApp[]>();
  private static readonly PAGE_SIZE = 12;

  /**
   * Búsqueda local simple y rápida
   */
  static search(query: string, page = 0): { results: SearchableApp[]; total: number; hasMore: boolean } {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) {
      return this.getFeatured(page);
    }

    // Verificar cache
    const cacheKey = `${normalizedQuery}-${page}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      const startIndex = page * this.PAGE_SIZE;
      const endIndex = startIndex + this.PAGE_SIZE;
      
      return {
        results: cached.slice(startIndex, endIndex),
        total: cached.length,
        hasMore: endIndex < cached.length
      };
    }

    // Búsqueda simple en el array local
    const matches = LOCAL_PACKAGES.filter(app => {
      const searchText = `${app.name} ${app.description} ${app.id}`.toLowerCase();
      return searchText.includes(normalizedQuery);
    });

    // Ordenar por relevancia
    matches.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(normalizedQuery) ? 2 : 0;
      const bNameMatch = b.name.toLowerCase().includes(normalizedQuery) ? 2 : 0;
      const aIdMatch = a.id.includes(normalizedQuery) ? 1 : 0;
      const bIdMatch = b.id.includes(normalizedQuery) ? 1 : 0;
      
      return (bNameMatch + bIdMatch) - (aNameMatch + aIdMatch);
    });

    // Guardar en cache
    this.cache.set(normalizedQuery, matches);

    // Enrich with architecture info if missing
    const enrichedMatches = this.enrichWithArchitecture(matches);

    // Paginar resultados
    const startIndex = page * this.PAGE_SIZE;
    const endIndex = startIndex + this.PAGE_SIZE;

    return {
      results: enrichedMatches.slice(startIndex, endIndex),
      total: enrichedMatches.length,
      hasMore: endIndex < enrichedMatches.length
    };
  }

  /**
   * Obtener aplicaciones destacadas
   */
  static getFeatured(page = 0): { results: SearchableApp[]; total: number; hasMore: boolean } {
    const featured = LOCAL_PACKAGES.slice(0, 24).map(app => ({
      ...app,
      isSpecial: true
    }));

    const startIndex = page * this.PAGE_SIZE;
    const endIndex = startIndex + this.PAGE_SIZE;

    return {
      results: featured.slice(startIndex, endIndex),
      total: featured.length,
      hasMore: endIndex < featured.length
    };
  }

  /**
   * Obtener por categoría
   */
  static getByCategory(category: string, page = 0): { results: SearchableApp[]; total: number; hasMore: boolean } {
    const matches = LOCAL_PACKAGES.filter(app => app.category === category);
    
    const startIndex = page * this.PAGE_SIZE;
    const endIndex = startIndex + this.PAGE_SIZE;

    return {
      results: matches.slice(startIndex, endIndex),
      total: matches.length,
      hasMore: endIndex < matches.length
    };
  }

  /**
   * Obtener todas las categorías
   */
  static getCategories(): string[] {
    const categories = new Set(LOCAL_PACKAGES.map(app => app.category));
    return Array.from(categories).sort();
  }

  /**
   * Limpiar cache
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Enrich apps with architecture information if missing
   */
  private static enrichWithArchitecture(apps: SearchableApp[]): SearchableApp[] {
    return apps.map(app => {
      // If app already has architecture info, keep it
      if (app.architecture) {
        return app;
      }

      // Try to detect architecture support
      const architectureSupport = ArchitectureDetectionService.getArchitectureSupport(
        app.id,
        app.name,
        app.installType
      );

      if (architectureSupport) {
        return {
          ...app,
          architecture: architectureSupport
        };
      }

      return app;
    });
  }
}

export default LocalSearchService;
