import type { App, ScriptGenerationOptions } from '../types';

export class ScriptGenerator {
  private static getInstallCommand(app: App): string {
    switch (app.installType) {
      case 'brew':
        return `brew install ${app.command}`;
      case 'brew-cask':
        return `brew install --cask ${app.command}`;
      case 'curl-script':
        return app.command;
      case 'xcode-select':
        return app.command;
      case 'mas':
        return `mas install ${app.command}`;
      default:
        return app.command;
    }
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
    exit 1
}

# Verificar si estamos en macOS
if [[ "$(uname)" != "Darwin" ]]; then
    show_error "Este script solo funciona en macOS"
fi
`;
  }

  private static generateHomebrewInstallation(): string {
    return `
# Instalar Homebrew
show_progress "Instalando Homebrew (gestor de paquetes)..."
if ! command -v brew &> /dev/null; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
    show_success "Homebrew instalado correctamente"
else
    show_success "Homebrew ya está instalado"
fi

# Actualizar Homebrew
show_progress "Actualizando Homebrew..."
brew update
show_success "Homebrew actualizado"
`;
  }

  private static generateXcodeInstallation(): string {
    return `
# Instalar Xcode Command Line Tools
show_progress "Instalando Xcode Command Line Tools..."
if ! xcode-select -p &> /dev/null; then
    xcode-select --install
    echo "⚠️  Se abrirá una ventana para instalar Xcode Command Line Tools."
    echo "    Por favor, sigue las instrucciones y presiona Enter cuando termine."
    read -p "Presiona Enter para continuar..."
    show_success "Xcode Command Line Tools instalado"
else
    show_success "Xcode Command Line Tools ya está instalado"
fi
`;
  }

  private static generateOhMyZshInstallation(): string {
    return `
# Instalar Oh My Zsh
show_progress "Instalando Oh My Zsh..."
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
    show_success "Oh My Zsh instalado correctamente"
    echo "💡 Para activar Oh My Zsh, reinicia tu terminal o ejecuta: source ~/.zshrc"
else
    show_success "Oh My Zsh ya está instalado"
fi
`;
  }

  private static generateBrewPackagesInstallation(apps: App[]): string {
    if (apps.length === 0) return '';

    const packages = apps.map(app => app.command).join(' ');
    
    return `
# Instalar paquetes con Homebrew
show_progress "Instalando paquetes de línea de comandos..."
brew install ${packages}
show_success "Paquetes de línea de comandos instalados"
`;
  }

  private static generateCaskInstallation(apps: App[]): string {
    if (apps.length === 0) return '';

    let script = `
# Instalar aplicaciones con Homebrew Cask
show_progress "Instalando aplicaciones..."`;

    apps.forEach(app => {
      script += `
echo "  → Instalando ${app.name}..."
brew install --cask ${app.command}`;
    });

    script += `
show_success "Aplicaciones instaladas correctamente"
`;

    return script;
  }

  private static generateFooter(apps: App[]): string {
    const appList = apps.map(app => `echo "  - ${app.name}"`).join('\n');
    
    const postInstallNotes = apps
      .filter(app => app.postInstallNotes)
      .map(app => `echo "💡 ${app.name}: ${app.postInstallNotes}"`)
      .join('\n');

    return `
echo ""
echo "🎉 ¡Configuración completada!"
echo "=================================================="
echo "Aplicaciones instaladas:"
${appList}
echo ""
${postInstallNotes ? `${postInstallNotes}\necho ""` : ''}echo "🔄 Es recomendable reiniciar algunas aplicaciones para aplicar todos los cambios."
echo "💡 Puedes personalizar aún más tu configuración según tus necesidades."
`;
  }

  public static generate(
    selectedApps: App[], 
    options: ScriptGenerationOptions = {
      includeComments: true,
      includeProgressIndicators: true,
      includeErrorHandling: true
    }
  ): string {
    let script = this.generateHeader(options);

    if (options.includeProgressIndicators) {
      script += this.generateProgressFunctions();
    }

    // Separate apps by type
    const homebrew = selectedApps.find(app => app.id === 'homebrew');
    const xcode = selectedApps.find(app => app.id === 'xcode-tools');
    const ohMyZsh = selectedApps.find(app => app.id === 'oh-my-zsh');
    
    const brewApps = selectedApps.filter(app => 
      app.installType === 'brew' && app.id !== 'homebrew'
    );
    
    const caskApps = selectedApps.filter(app => 
      app.installType === 'brew-cask'
    );

    // Install Homebrew first if selected
    if (homebrew) {
      script += this.generateHomebrewInstallation();
    }

    // Install Xcode Command Line Tools if selected
    if (xcode) {
      script += this.generateXcodeInstallation();
    }

    // Install brew packages
    if (brewApps.length > 0) {
      script += this.generateBrewPackagesInstallation(brewApps);
    }

    // Install cask applications
    if (caskApps.length > 0) {
      script += this.generateCaskInstallation(caskApps);
    }

    // Install Oh My Zsh if selected
    if (ohMyZsh) {
      script += this.generateOhMyZshInstallation();
    }

    // Add footer
    script += this.generateFooter(selectedApps);

    return script;
  }

  public static downloadScript(content: string, filename = 'macos-setup.sh'): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  public static async copyToClipboard(content: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }
}
