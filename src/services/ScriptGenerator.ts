import type { SearchableApp, ScriptGenerationOptions } from '../types/api';

export class ScriptGenerator {
  private static getInstallCommand(app: SearchableApp): string {
    return app.command;
  }

  private static generateHeader(options: ScriptGenerationOptions): string {
    const date = new Date().toLocaleDateString('es-ES');
    
    return `#!/bin/bash

# macOS Setup Script
# Generado por macOS Setup Assistant
# Fecha: ${date}
${options.customHeader ? `# ${options.customHeader}` : ''}

set -e  # Exit on any error

echo "🍎 Iniciando configuración de macOS..."
echo "=================================================="
`;
  }

  private static generateProgressFunctions(): string {
    return `
# Función para mostrar progreso
show_progress() {
    echo ""
    echo "🔄 $1"
    echo "--------------------------------------------------"
}

# Función para mostrar éxito
show_success() {
    echo "✅ $1"
}

# Función para mostrar error
show_error() {
    echo "❌ Error: $1"
}
`;
  }

  private static generateHomebrewInstallation(options: ScriptGenerationOptions): string {
    const updateSection = options.includeUpdates ? `
# Actualizar Homebrew
show_progress "Actualizando Homebrew..."
brew update
${options.verboseOutput ? 'brew upgrade --verbose' : 'brew upgrade'}
show_success "Homebrew actualizado"
` : `
# Actualizar Homebrew
echo "Actualizando Homebrew..."
brew update
`;

    return `
# Verificar e instalar Homebrew
show_progress "Verificando Homebrew..."
if ! command -v brew &> /dev/null; then
    echo "Homebrew no encontrado. Instalando..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Agregar Homebrew al PATH para Apple Silicon Macs
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    
    show_success "Homebrew instalado correctamente"
else
    echo "✅ Homebrew ya está instalado"
fi
${updateSection}
`;
  }

  private static generatePackageInstallation(apps: SearchableApp[], options: ScriptGenerationOptions): string {
    const brewApps = apps.filter(app => app.installType === 'brew');
    const caskApps = apps.filter(app => app.installType === 'brew-cask');

    let script = '';
    const verboseFlag = options.verboseOutput ? ' --verbose' : '';

    // Install CLI packages
    if (brewApps.length > 0) {
      script += `
show_progress "Instalando herramientas de línea de comandos (${brewApps.length})..."`;

      brewApps.forEach(app => {
        script += `
echo "  → Instalando ${app.name}..."
if ${this.getInstallCommand(app)}${verboseFlag}; then
    show_success "${app.name} instalado"
else
    show_error "No se pudo instalar ${app.name}"
    ${options.skipConfirmations ? '' : 'read -p "¿Continuar con la instalación? (y/n): " -n 1 -r; echo; [[ $REPLY =~ ^[Yy]$ ]] || exit 1'}
fi`;
      });
    }

    // Install GUI applications
    if (caskApps.length > 0) {
      script += `
show_progress "Instalando aplicaciones (${caskApps.length})..."`;

      caskApps.forEach(app => {
        script += `
echo "  → Instalando ${app.name}..."
if ${this.getInstallCommand(app)}${verboseFlag}; then
    show_success "${app.name} instalado"
else
    show_error "No se pudo instalar ${app.name}"
    ${options.skipConfirmations ? '' : 'read -p "¿Continuar con la instalación? (y/n): " -n 1 -r; echo; [[ $REPLY =~ ^[Yy]$ ]] || exit 1'}
fi`;
      });
    }

    return script;
  }

  private static generateCleanup(options: ScriptGenerationOptions): string {
    if (!options.includeCleanup) return '';

    return `
show_progress "Limpiando archivos temporales..."
brew cleanup
show_success "Limpieza completada"
`;
  }

  private static generateFooter(apps: SearchableApp[]): string {
    const brewApps = apps.filter(app => app.installType === 'brew');
    const caskApps = apps.filter(app => app.installType === 'brew-cask');

    return `
echo ""
echo "🎉 ¡Configuración de macOS completada!"
echo "=================================================="
echo "📦 Resumen de instalación:"
echo "   • ${brewApps.length} herramientas de línea de comandos"
echo "   • ${caskApps.length} aplicaciones"
echo "   • Total: ${apps.length} paquetes"
echo ""
echo "📋 Aplicaciones instaladas:"
${apps.map(app => `echo "   ✓ ${app.name} (${app.installType === 'brew' ? 'CLI' : 'APP'})"`).join('\n')}
echo ""
echo "💡 Para verificar las instalaciones, ejecuta:"
echo "   brew list --formula  # Herramientas CLI"
echo "   brew list --cask     # Aplicaciones"
echo ""
echo "✨ ¡Disfruta tu macOS configurado!"
`;
  }

  /**
   * Main script generation method
   */
  static generate(
    selectedApps: SearchableApp[],
    options: ScriptGenerationOptions = {}
  ): string {
    return this.generateInstallScript(selectedApps, options);
  }

  /**
   * Generate a complete installation script
   */
  static generateInstallScript(
    selectedApps: SearchableApp[],
    options: ScriptGenerationOptions = {}
  ): string {
    const defaultOptions: ScriptGenerationOptions = {
      includeUpdates: true,
      includeCleanup: true,
      verboseOutput: false,
      skipConfirmations: false,
      ...options
    };

    if (selectedApps.length === 0) {
      return '# No hay aplicaciones seleccionadas para instalar';
    }

    const script = [
      this.generateHeader(defaultOptions),
      this.generateProgressFunctions(),
      this.generateHomebrewInstallation(defaultOptions),
      this.generatePackageInstallation(selectedApps, defaultOptions),
      this.generateCleanup(defaultOptions),
      this.generateFooter(selectedApps)
    ].join('\n');

    return script;
  }

  /**
   * Generate a simple list of brew commands
   */
  static generateCommandList(selectedApps: SearchableApp[]): string {
    if (selectedApps.length === 0) {
      return '# No hay aplicaciones seleccionadas';
    }

    const brewApps = selectedApps.filter(app => app.installType === 'brew');
    const caskApps = selectedApps.filter(app => app.installType === 'brew-cask');

    let commands = '# Comandos de instalación\n\n';
    
    if (brewApps.length > 0) {
      commands += '# Herramientas de línea de comandos\n';
      brewApps.forEach(app => {
        commands += `${app.command}  # ${app.name}\n`;
      });
      commands += '\n';
    }

    if (caskApps.length > 0) {
      commands += '# Aplicaciones\n';
      caskApps.forEach(app => {
        commands += `${app.command}  # ${app.name}\n`;
      });
    }

    return commands;
  }

  /**
   * Generate Brewfile for use with `brew bundle`
   */
  static generateBrewfile(selectedApps: SearchableApp[]): string {
    if (selectedApps.length === 0) {
      return '# No hay aplicaciones seleccionadas';
    }

    const brewApps = selectedApps.filter(app => app.installType === 'brew');
    const caskApps = selectedApps.filter(app => app.installType === 'brew-cask');

    let brewfile = '# Brewfile generado por macOS Setup Assistant\n\n';

    if (brewApps.length > 0) {
      brewfile += '# Herramientas de línea de comandos\n';
      brewApps.forEach(app => {
        // Extract package name from command
        const packageName = app.command.replace('brew install ', '');
        brewfile += `brew "${packageName}"  # ${app.name}\n`;
      });
      brewfile += '\n';
    }

    if (caskApps.length > 0) {
      brewfile += '# Aplicaciones\n';
      caskApps.forEach(app => {
        // Extract package name from command
        const packageName = app.command.replace('brew install --cask ', '');
        brewfile += `cask "${packageName}"  # ${app.name}\n`;
      });
    }

    brewfile += '\n# Para instalar: brew bundle --file=Brewfile\n';

    return brewfile;
  }

  /**
   * Download script as file
   */
  static downloadScript(content: string, filename: string = 'setup-script.sh'): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Copy script to clipboard
   */
  static async copyToClipboard(content: string): Promise<void> {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(content);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
  }
}
