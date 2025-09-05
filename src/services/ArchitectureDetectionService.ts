/**
 * Service to detect and provide architecture support information for Homebrew packages
 */
export class ArchitectureDetectionService {
  // Known apps with confirmed architecture support
  private static readonly ARCHITECTURE_DATABASE = new Map<string, { arm64: boolean; intel: boolean }>([
    // Browsers - Most modern browsers support both
    ['google-chrome', { arm64: true, intel: true }],
    ['firefox', { arm64: true, intel: true }],
    ['microsoft-edge', { arm64: true, intel: true }],
    ['safari-technology-preview', { arm64: true, intel: true }],
    ['brave-browser', { arm64: true, intel: true }],
    ['opera', { arm64: true, intel: true }],
    
    // Development Tools
    ['visual-studio-code', { arm64: true, intel: true }],
    ['docker', { arm64: true, intel: true }],
    ['postman', { arm64: true, intel: true }],
    ['github', { arm64: true, intel: true }], // GitHub Desktop
    ['sourcetree', { arm64: false, intel: true }], // Still Intel only
    ['sublime-text', { arm64: true, intel: true }],
    ['atom', { arm64: true, intel: true }],
    ['webstorm', { arm64: true, intel: true }],
    ['intellij-idea', { arm64: true, intel: true }],
    ['android-studio', { arm64: true, intel: true }],
    ['xcode', { arm64: true, intel: true }],
    
    // Communication
    ['slack', { arm64: true, intel: true }],
    ['discord', { arm64: true, intel: true }],
    ['telegram', { arm64: true, intel: true }],
    ['zoom', { arm64: true, intel: true }],
    ['microsoft-teams', { arm64: true, intel: true }],
    ['skype', { arm64: true, intel: true }],
    ['whatsapp', { arm64: true, intel: true }],
    
    // Media & Entertainment
    ['spotify', { arm64: true, intel: true }],
    ['vlc', { arm64: true, intel: true }],
    ['plex', { arm64: true, intel: true }],
    ['netflix', { arm64: true, intel: true }],
    ['youtube-music', { arm64: true, intel: true }],
    
    // Design & Creative
    ['figma', { arm64: true, intel: true }],
    ['sketch', { arm64: true, intel: true }],
    ['adobe-creative-cloud', { arm64: true, intel: true }],
    ['canva', { arm64: true, intel: true }],
    
    // Productivity
    ['notion', { arm64: true, intel: true }],
    ['obsidian', { arm64: true, intel: true }],
    ['evernote', { arm64: true, intel: true }],
    ['dropbox', { arm64: true, intel: true }],
    ['google-drive', { arm64: true, intel: true }],
    
    // Utilities
    ['rectangle', { arm64: true, intel: true }],
    ['alfred', { arm64: true, intel: true }],
    ['cleanmymac', { arm64: true, intel: true }],
    ['appcleaner', { arm64: true, intel: true }],
    ['the-unarchiver', { arm64: true, intel: true }],
    ['1password', { arm64: true, intel: true }],
    ['lastpass', { arm64: true, intel: true }],
    ['malwarebytes', { arm64: true, intel: true }],
    
    // CLI Tools - Most Homebrew formula support both architectures
    ['git', { arm64: true, intel: true }],
    ['node', { arm64: true, intel: true }],
    ['python', { arm64: true, intel: true }],
    ['yarn', { arm64: true, intel: true }],
    ['npm', { arm64: true, intel: true }],
    ['wget', { arm64: true, intel: true }],
    ['curl', { arm64: true, intel: true }],
    ['vim', { arm64: true, intel: true }],
    ['neovim', { arm64: true, intel: true }],
    ['tmux', { arm64: true, intel: true }],
    ['htop', { arm64: true, intel: true }],
    ['tree', { arm64: true, intel: true }],
    ['jq', { arm64: true, intel: true }],
    ['ffmpeg', { arm64: true, intel: true }],
    ['imagemagick', { arm64: true, intel: true }],
    ['postgresql', { arm64: true, intel: true }],
    ['mysql', { arm64: true, intel: true }],
    ['redis', { arm64: true, intel: true }],
    ['mongodb', { arm64: true, intel: true }],
    
    // Legacy or Intel-only apps
    ['parallels', { arm64: true, intel: true }],
    ['vmware-fusion', { arm64: false, intel: true }], // Still working on ARM support
    ['virtualbox', { arm64: false, intel: true }], // Intel only
  ]);

  /**
   * Get architecture support for a given app
   */
  static getArchitectureSupport(appId: string, appName: string, installType: 'brew' | 'brew-cask'): { arm64: boolean; intel: boolean } | undefined {
    // First check our known database
    const knownSupport = this.ARCHITECTURE_DATABASE.get(appId);
    if (knownSupport) {
      return knownSupport;
    }

    // Check by normalized name
    const normalizedName = this.normalizeAppName(appName);
    const knownSupportByName = this.ARCHITECTURE_DATABASE.get(normalizedName);
    if (knownSupportByName) {
      return knownSupportByName;
    }

    // Apply heuristics based on app type and patterns
    return this.detectArchitectureByHeuristics(appId, appName, installType);
  }

  /**
   * Normalize app name for consistent lookup
   */
  private static normalizeAppName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Use heuristics to detect likely architecture support
   */
  private static detectArchitectureByHeuristics(appId: string, appName: string, installType: 'brew' | 'brew-cask'): { arm64: boolean; intel: true } | undefined {
    const nameId = `${appId} ${appName}`.toLowerCase();
    
    // CLI tools (brew formula) - most support both architectures
    if (installType === 'brew') {
      // Modern tools usually support both
      if (this.isModernTool(nameId)) {
        return { arm64: true, intel: true };
      }
      
      // Legacy tools might be Intel only
      if (this.isLegacyTool(nameId)) {
        return { arm64: false, intel: true };
      }
      
      // Default assumption for CLI tools
      return { arm64: true, intel: true };
    }

    // GUI applications (casks)
    if (installType === 'brew-cask') {
      // Popular modern apps usually support both
      if (this.isPopularModernApp(nameId)) {
        return { arm64: true, intel: true };
      }
      
      // Specialized or legacy apps might be Intel only
      if (this.isSpecializedOrLegacyApp(nameId)) {
        return { arm64: false, intel: true };
      }
      
      // Default for GUI apps - assume both unless known otherwise
      return { arm64: true, intel: true };
    }

    return undefined;
  }

  /**
   * Check if it's a modern development tool
   */
  private static isModernTool(nameId: string): boolean {
    const modernPatterns = [
      'node', 'python', 'rust', 'go', 'java', 'kotlin', 'swift',
      'git', 'yarn', 'npm', 'pnpm', 'docker', 'kubernetes',
      'terraform', 'ansible', 'aws', 'gcp', 'azure'
    ];
    
    return modernPatterns.some(pattern => nameId.includes(pattern));
  }

  /**
   * Check if it's a legacy tool
   */
  private static isLegacyTool(nameId: string): boolean {
    const legacyPatterns = [
      'fortran', 'cobol', 'pascal', 'ada',
      'x11', 'xorg', 'gtk2'
    ];
    
    return legacyPatterns.some(pattern => nameId.includes(pattern));
  }

  /**
   * Check if it's a popular modern GUI app
   */
  private static isPopularModernApp(nameId: string): boolean {
    const popularPatterns = [
      'chrome', 'firefox', 'safari', 'edge', 'brave',
      'code', 'vscode', 'atom', 'sublime',
      'slack', 'discord', 'telegram', 'zoom', 'teams',
      'spotify', 'netflix', 'youtube',
      'figma', 'sketch', 'canva',
      'notion', 'obsidian', 'evernote'
    ];
    
    return popularPatterns.some(pattern => nameId.includes(pattern));
  }

  /**
   * Check if it's a specialized or legacy GUI app
   */
  private static isSpecializedOrLegacyApp(nameId: string): boolean {
    const specializedPatterns = [
      'virtualbox', 'vmware', 'parallels',
      'x11', 'xquartz', 'wine',
      'flash', 'shockwave', 'silverlight'
    ];
    
    return specializedPatterns.some(pattern => nameId.includes(pattern));
  }
}
