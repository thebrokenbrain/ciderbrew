import type { SearchableApp, SearchResult } from '../types/api';

class BrewApiService {
  private static searchCache = new Map<string, SearchableApp[]>();

  // Curated list of popular packages for faster search
  private static readonly POPULAR_PACKAGES: Record<string, SearchableApp> = {
    // Development Tools
    'git': {
      id: 'formula-git',
      name: 'git',
      description: 'Distributed revision control system',
      homepage: 'https://git-scm.com',
      version: 'latest',
      installType: 'brew',
      command: 'brew install git',
      category: 'Development',
      source: 'homebrew'
    },
    'node': {
      id: 'formula-node',
      name: 'node',
      description: 'Platform built on V8 to build network applications',
      homepage: 'https://nodejs.org',
      version: 'latest',
      installType: 'brew',
      command: 'brew install node',
      category: 'Development',
      source: 'homebrew'
    },
    'python': {
      id: 'formula-python',
      name: 'python',
      description: 'Interpreted, interactive, object-oriented programming language',
      homepage: 'https://www.python.org',
      version: 'latest',
      installType: 'brew',
      command: 'brew install python',
      category: 'Development',
      source: 'homebrew'
    },
    'docker': {
      id: 'cask-docker',
      name: 'Docker Desktop',
      description: 'App to build and share containerized applications',
      homepage: 'https://www.docker.com',
      version: 'latest',
      installType: 'brew-cask',
      command: 'brew install --cask docker',
      category: 'Development',
      source: 'homebrew'
    },
    'code': {
      id: 'cask-visual-studio-code',
      name: 'Visual Studio Code',
      description: 'Open-source code editor',
      homepage: 'https://code.visualstudio.com',
      version: 'latest',
      installType: 'brew-cask',
      command: 'brew install --cask visual-studio-code',
      category: 'Development',
      source: 'homebrew'
    },
    'vscode': {
      id: 'cask-visual-studio-code-alt',
      name: 'Visual Studio Code',
      description: 'Open-source code editor',
      homepage: 'https://code.visualstudio.com',
      version: 'latest',
      installType: 'brew-cask',
      command: 'brew install --cask visual-studio-code',
      category: 'Development',
      source: 'homebrew'
    },
    
    // Browsers
    'chrome': {
      id: 'cask-google-chrome',
      name: 'Google Chrome',
      description: 'Web browser',
      homepage: 'https://www.google.com/chrome',
      version: 'latest',
      installType: 'brew-cask',
      command: 'brew install --cask google-chrome',
      category: 'Browsers',
      source: 'homebrew'
    },
    'firefox': {
      id: 'cask-firefox',
      name: 'Mozilla Firefox',
      description: 'Web browser',
      homepage: 'https://www.mozilla.org/firefox',
      version: 'latest',
      installType: 'brew-cask',
      command: 'brew install --cask firefox',
      category: 'Browsers',
      source: 'homebrew'
    },
    
    // Communication
    'slack': {
      id: 'cask-slack',
      name: 'Slack',
      description: 'Team communication and collaboration software',
      homepage: 'https://slack.com',
      version: 'latest',
      installType: 'brew-cask',
      command: 'brew install --cask slack',
      category: 'Communication',
      source: 'homebrew'
    },
    'discord': {
      id: 'cask-discord',
      name: 'Discord',
      description: 'Voice and text chat software',
      homepage: 'https://discord.com',
      version: 'latest',
      installType: 'brew-cask',
      command: 'brew install --cask discord',
      category: 'Communication',
      source: 'homebrew'
    },
    'telegram': {
      id: 'cask-telegram',
      name: 'Telegram',
      description: 'Messaging app',
      homepage: 'https://telegram.org',
      version: 'latest',
      installType: 'brew-cask',
      command: 'brew install --cask telegram',
      category: 'Communication',
      source: 'homebrew'
    },
    'zoom': {
      id: 'cask-zoom',
      name: 'Zoom',
      description: 'Video communication and virtual meeting platform',
      homepage: 'https://zoom.us',
      version: 'latest',
      installType: 'brew-cask',
      command: 'brew install --cask zoom',
      category: 'Communication',
      source: 'homebrew'
    },
    
    // Media
    'spotify': {
      id: 'cask-spotify',
      name: 'Spotify',
      description: 'Music streaming service',
      homepage: 'https://spotify.com',
      version: 'latest',
      installType: 'brew-cask',
      command: 'brew install --cask spotify',
      category: 'Media',
      source: 'homebrew'
    },
    'vlc': {
      id: 'cask-vlc',
      name: 'VLC Media Player',
      description: 'Multimedia player',
      homepage: 'https://www.videolan.org/vlc',
      version: 'latest',
      installType: 'brew-cask',
      command: 'brew install --cask vlc',
      category: 'Media',
      source: 'homebrew'
    },
    
    // Design
    'figma': {
      id: 'cask-figma',
      name: 'Figma',
      description: 'Collaborative design tool',
      homepage: 'https://figma.com',
      version: 'latest',
      installType: 'brew-cask',
      command: 'brew install --cask figma',
      category: 'Design',
      source: 'homebrew'
    },
    
    // Utilities
    'postman': {
      id: 'cask-postman',
      name: 'Postman',
      description: 'Collaboration platform for API development',
      homepage: 'https://postman.com',
      version: 'latest',
      installType: 'brew-cask',
      command: 'brew install --cask postman',
      category: 'Development',
      source: 'homebrew'
    }
  };

  /**
   * Search packages using curated list and fuzzy matching
   */
  static async searchPackages(query: string, limit = 20): Promise<SearchResult> {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) {
      return { formulas: [], casks: [], total: 0 };
    }

    // Check cache first
    const cacheKey = `${normalizedQuery}-${limit}`;
    if (this.searchCache.has(cacheKey)) {
      const cached = this.searchCache.get(cacheKey)!;
      return this.convertToSearchResult(cached);
    }

    // Perform search
    const results = this.performCuratedSearch(normalizedQuery, limit);
    
    // Cache results
    this.searchCache.set(cacheKey, results);
    
    // Clean old cache entries
    if (this.searchCache.size > 100) {
      const firstKey = this.searchCache.keys().next().value;
      if (firstKey) {
        this.searchCache.delete(firstKey);
      }
    }

    return this.convertToSearchResult(results);
  }

  /**
   * Convert SearchableApp array to SearchResult format
   */
  private static convertToSearchResult(apps: SearchableApp[]): SearchResult {
    return {
      formulas: apps.filter(app => app.installType === 'brew') as any[],
      casks: apps.filter(app => app.installType === 'brew-cask') as any[],
      total: apps.length
    };
  }

  /**
   * Perform curated search with known packages
   */
  private static performCuratedSearch(query: string, limit: number): SearchableApp[] {
    const results: SearchableApp[] = [];
    const queryTerms = query.split(' ').map(term => term.toLowerCase());

    // Search in our curated packages
    Object.entries(this.POPULAR_PACKAGES).forEach(([key, app]) => {
      // Check if any query term matches
      const matches = queryTerms.some(term => 
        key.includes(term) ||
        app.name.toLowerCase().includes(term) ||
        app.description.toLowerCase().includes(term)
      );

      if (matches) {
        results.push(app);
      }
    });

    // Sort by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExact = a.name.toLowerCase().includes(query) ? 1 : 0;
      const bExact = b.name.toLowerCase().includes(query) ? 1 : 0;
      return bExact - aExact;
    });

    return results.slice(0, limit);
  }

  /**
   * Convert search results to SearchableApp format
   */
  static convertToSearchableApps(searchResult: SearchResult): SearchableApp[] {
    return [
      ...searchResult.formulas.map(formula => ({
        id: `formula-${formula.name || 'unknown'}`,
        name: formula.name || 'Unknown Formula',
        description: formula.desc || 'Command line tool',
        homepage: formula.homepage || '',
        version: formula.versions?.stable || 'latest',
        installType: 'brew' as const,
        command: `brew install ${formula.name}`,
        category: this.categorizePackage(formula.name || '', formula.desc || ''),
        source: 'homebrew' as const
      })),
      ...searchResult.casks.map(cask => ({
        id: `cask-${cask.token || 'unknown'}`,
        name: cask.name?.[0] || cask.token || 'Unknown App',
        description: cask.desc || 'GUI Application',
        homepage: cask.homepage || '',
        version: cask.version || 'latest',
        installType: 'brew-cask' as const,
        command: `brew install --cask ${cask.token}`,
        category: this.categorizePackage(cask.token || '', cask.desc || ''),
        source: 'homebrew' as const
      }))
    ];
  }

  /**
   * Get popular/featured packages
   */
  static async getFeaturedPackages(): Promise<SearchableApp[]> {
    // Return a selection of popular packages
    const featured = [
      'git', 'code', 'chrome', 'firefox', 'slack', 'discord', 
      'spotify', 'vlc', 'zoom', 'figma', 'docker', 'node'
    ];

    return featured
      .map(key => this.POPULAR_PACKAGES[key])
      .filter(Boolean)
      .map(app => ({
        ...app,
        isSpecial: true
      }));
  }

  /**
   * Categorize a package based on its name and description
   */
  private static categorizePackage(name: string, description: string): string {
    const content = `${name} ${description}`.toLowerCase();

    if (content.match(/browser|chrome|firefox|safari|edge/)) return 'Browsers';
    if (content.match(/editor|ide|code|vim|emacs|atom|sublime/)) return 'Development';
    if (content.match(/music|audio|video|media|player|vlc|spotify/)) return 'Media';
    if (content.match(/chat|message|slack|discord|telegram|whatsapp/)) return 'Communication';
    if (content.match(/design|figma|sketch|photoshop|illustrator/)) return 'Design';
    if (content.match(/security|password|vpn|encrypt|antivirus/)) return 'Security';
    if (content.match(/utility|tool|system|clean|monitor|activity/)) return 'Utilities';
    if (content.match(/game|gaming|steam|minecraft/)) return 'Games';
    if (content.match(/database|sql|mongo|redis|postgres/)) return 'Database';
    if (content.match(/terminal|shell|command|cli/)) return 'Terminal';
    
    return 'General';
  }

  /**
   * Clear cache
   */
  static clearCache(): void {
    this.searchCache.clear();
  }

  /**
   * Get cache status
   */
  static getCacheStatus(): { 
    size: number;
    keys: string[];
  } {
    return {
      size: this.searchCache.size,
      keys: Array.from(this.searchCache.keys())
    };
  }
}

export default BrewApiService;
