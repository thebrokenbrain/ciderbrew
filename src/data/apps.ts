import type { AppConfig } from '../types';

export const appConfig: AppConfig = {
  categories: {
    desarrollo: {
      name: 'Desarrollo',
      icon: 'fa-code',
      description: 'Herramientas para desarrolladores'
    },
    productividad: {
      name: 'Productividad',
      icon: 'fa-briefcase',
      description: 'Aplicaciones para aumentar tu productividad'
    },
    multimedia: {
      name: 'Multimedia',
      icon: 'fa-play',
      description: 'Audio, video y entretenimiento'
    },
    utilidades: {
      name: 'Utilidades',
      icon: 'fa-tools',
      description: 'Herramientas del sistema'
    },
    configuracion: {
      name: 'Configuración',
      icon: 'fa-cog',
      description: 'Configuración del sistema y shell'
    },
    custom: {
      name: 'Custom',
      icon: 'fa-puzzle-piece',
      description: 'Instalaciones personalizadas y especiales'
    }
  },
  apps: [
    // Desarrollo
    {
      id: 'visual-studio-code',
      name: 'Visual Studio Code',
      description: 'Editor de código moderno y potente',
      icon: 'fa-code',
      category: 'desarrollo',
      installType: 'brew-cask',
      command: 'visual-studio-code'
    },
    {
      id: 'git',
      name: 'Git',
      description: 'Sistema de control de versiones',
      icon: 'fab fa-git-alt',
      category: 'desarrollo',
      installType: 'brew',
      command: 'git'
    },
    {
      id: 'node',
      name: 'Node.js',
      description: 'Runtime de JavaScript',
      icon: 'fab fa-node-js',
      category: 'desarrollo',
      installType: 'brew',
      command: 'node'
    },
    {
      id: 'docker',
      name: 'Docker Desktop',
      description: 'Containerización de aplicaciones',
      icon: 'fab fa-docker',
      category: 'desarrollo',
      installType: 'brew-cask',
      command: 'docker'
    },
    {
      id: 'iterm2',
      name: 'iTerm2',
      description: 'Terminal avanzado para macOS',
      icon: 'fa-terminal',
      category: 'desarrollo',
      installType: 'brew-cask',
      command: 'iterm2'
    },
    {
      id: 'postman',
      name: 'Postman',
      description: 'Herramienta para testing de APIs',
      icon: 'fa-satellite-dish',
      category: 'desarrollo',
      installType: 'brew-cask',
      command: 'postman'
    },
    {
      id: 'github-desktop',
      name: 'GitHub Desktop',
      description: 'Cliente gráfico para Git y GitHub',
      icon: 'fab fa-github',
      category: 'desarrollo',
      installType: 'brew-cask',
      command: 'github'
    },
    {
      id: 'insomnia',
      name: 'Insomnia',
      description: 'Cliente REST y GraphQL',
      icon: 'fa-moon',
      category: 'desarrollo',
      installType: 'brew-cask',
      command: 'insomnia'
    },

    // Productividad
    {
      id: 'google-chrome',
      name: 'Google Chrome',
      description: 'Navegador web moderno',
      icon: 'fab fa-chrome',
      category: 'productividad',
      installType: 'brew-cask',
      command: 'google-chrome'
    },
    {
      id: 'firefox',
      name: 'Firefox',
      description: 'Navegador web open source',
      icon: 'fab fa-firefox',
      category: 'productividad',
      installType: 'brew-cask',
      command: 'firefox'
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Espacio de trabajo todo-en-uno',
      icon: 'fa-sticky-note',
      category: 'productividad',
      installType: 'brew-cask',
      command: 'notion'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Comunicación en equipo',
      icon: 'fab fa-slack',
      category: 'productividad',
      installType: 'brew-cask',
      command: 'slack'
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Videoconferencias',
      icon: 'fa-video',
      category: 'productividad',
      installType: 'brew-cask',
      command: 'zoom'
    },
    {
      id: 'obsidian',
      name: 'Obsidian',
      description: 'Notas y gestión del conocimiento',
      icon: 'fa-brain',
      category: 'productividad',
      installType: 'brew-cask',
      command: 'obsidian'
    },
    {
      id: 'raycast',
      name: 'Raycast',
      description: 'Launcher y herramientas de productividad',
      icon: 'fa-rocket',
      category: 'productividad',
      installType: 'brew-cask',
      command: 'raycast'
    },

    // Multimedia
    {
      id: 'vlc',
      name: 'VLC Media Player',
      description: 'Reproductor multimedia universal',
      icon: 'fa-play-circle',
      category: 'multimedia',
      installType: 'brew-cask',
      command: 'vlc'
    },
    {
      id: 'spotify',
      name: 'Spotify',
      description: 'Streaming de música',
      icon: 'fab fa-spotify',
      category: 'multimedia',
      installType: 'brew-cask',
      command: 'spotify'
    },
    {
      id: 'handbrake',
      name: 'HandBrake',
      description: 'Conversor de video',
      icon: 'fa-film',
      category: 'multimedia',
      installType: 'brew-cask',
      command: 'handbrake'
    },
    {
      id: 'audacity',
      name: 'Audacity',
      description: 'Editor de audio gratuito',
      icon: 'fa-microphone',
      category: 'multimedia',
      installType: 'brew-cask',
      command: 'audacity'
    },
    {
      id: 'obs',
      name: 'OBS Studio',
      description: 'Software de grabación y streaming',
      icon: 'fa-broadcast-tower',
      category: 'multimedia',
      installType: 'brew-cask',
      command: 'obs'
    },

    // Utilidades
    {
      id: 'the-unarchiver',
      name: 'The Unarchiver',
      description: 'Extractor de archivos comprimidos',
      icon: 'fa-file-archive',
      category: 'utilidades',
      installType: 'brew-cask',
      command: 'the-unarchiver'
    },
    {
      id: 'appcleaner',
      name: 'AppCleaner',
      description: 'Desinstalador completo de apps',
      icon: 'fa-broom',
      category: 'utilidades',
      installType: 'brew-cask',
      command: 'appcleaner'
    },
    {
      id: 'rectangle',
      name: 'Rectangle',
      description: 'Gestor de ventanas',
      icon: 'fa-expand-arrows-alt',
      category: 'utilidades',
      installType: 'brew-cask',
      command: 'rectangle'
    },
    {
      id: 'coconutbattery',
      name: 'coconutBattery',
      description: 'Monitor de batería',
      icon: 'fa-battery-half',
      category: 'utilidades',
      installType: 'brew-cask',
      command: 'coconutbattery'
    },
    {
      id: 'cleanmymac',
      name: 'CleanMyMac X',
      description: 'Optimización y limpieza del sistema',
      icon: 'fa-shield-alt',
      category: 'utilidades',
      installType: 'brew-cask',
      command: 'cleanmymac'
    },

    // Configuración
    {
      id: 'homebrew',
      name: 'Homebrew',
      description: 'Gestor de paquetes para macOS (requerido)',
      icon: 'fa-beer',
      category: 'configuracion',
      installType: 'curl-script',
      command: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
      isRequired: true,
      isSpecial: true
    },
    {
      id: 'oh-my-zsh',
      name: 'Oh My Zsh',
      description: 'Framework para Zsh con plugins y temas',
      icon: 'fa-terminal',
      category: 'custom',
      installType: 'custom',
      command: 'sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"',
      isSpecial: true,
      postInstallNotes: 'Para activar Oh My Zsh, reinicia tu terminal o ejecuta: source ~/.zshrc'
    },
    {
      id: 'xcode-tools',
      name: 'Xcode Command Line Tools',
      description: 'Herramientas de desarrollo de Apple',
      icon: 'fab fa-apple',
      category: 'custom',
      installType: 'custom',
      command: 'xcode-select --install',
      isSpecial: true,
      postInstallNotes: 'Se abrirá una ventana para instalar. Sigue las instrucciones.'
    },
    {
      id: 'mas',
      name: 'Mac App Store CLI',
      description: 'Instalar apps desde terminal',
      icon: 'fa-store',
      category: 'configuracion',
      installType: 'brew',
      command: 'mas'
    },
    
    // Custom Installations
    {
      id: 'xcode-full',
      name: 'Xcode (Completo)',
      description: 'IDE completo de Apple para desarrollo iOS/macOS',
      icon: 'fab fa-apple',
      category: 'custom',
      installType: 'custom',
      command: 'mas install 497799835',
      isSpecial: true,
      dependencies: ['mas'],
      postInstallNotes: 'Xcode es una descarga grande (~15GB). Asegúrate de tener espacio suficiente.'
    },
    {
      id: 'nvm',
      name: 'Node Version Manager',
      description: 'Gestor de versiones de Node.js',
      icon: 'fab fa-node-js',
      category: 'custom',
      installType: 'custom',
      command: 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash',
      isSpecial: true,
      postInstallNotes: 'Reinicia tu terminal y ejecuta: nvm install node && nvm use node'
    },
    {
      id: 'powerlevel10k',
      name: 'Powerlevel10k',
      description: 'Tema potente para Zsh con configuración rápida',
      icon: 'fa-bolt',
      category: 'custom',
      installType: 'custom',
      command: 'git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k',
      isSpecial: true,
      dependencies: ['oh-my-zsh'],
      postInstallNotes: 'Configura ZSH_THEME="powerlevel10k/powerlevel10k" en ~/.zshrc y ejecuta: p10k configure'
    },
    {
      id: 'rustup',
      name: 'Rust Toolchain',
      description: 'Instalador y gestor de versiones de Rust',
      icon: 'fa-cog',
      category: 'custom',
      installType: 'custom',
      command: 'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y',
      isSpecial: true,
      postInstallNotes: 'Reinicia tu terminal o ejecuta: source ~/.cargo/env'
    },
    {
      id: 'deno',
      name: 'Deno Runtime',
      description: 'Runtime moderno para JavaScript y TypeScript',
      icon: 'fa-code',
      category: 'custom',
      installType: 'custom',
      command: 'curl -fsSL https://deno.land/install.sh | sh',
      isSpecial: true,
      postInstallNotes: 'Agrega ~/.deno/bin al PATH en tu ~/.zshrc'
    },
    {
      id: 'bun',
      name: 'Bun Runtime',
      description: 'Runtime ultra-rápido para JavaScript/TypeScript',
      icon: 'fa-rocket',
      category: 'custom',
      installType: 'custom',
      command: 'curl -fsSL https://bun.sh/install | bash',
      isSpecial: true,
      postInstallNotes: 'Reinicia tu terminal para usar bun'
    }
  ]
};
