import { ScriptGenerator } from '../ScriptGenerator';
import type { App, ScriptGenerationOptions } from '../../types';

// Mock data for testing
const mockApps: App[] = [
  {
    id: 'homebrew',
    name: 'Homebrew',
    description: 'Package manager for macOS',
    icon: 'fa-beer',
    category: 'configuracion',
    installType: 'curl-script',
    command: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
    isRequired: true
  },
  {
    id: 'visual-studio-code',
    name: 'Visual Studio Code',
    description: 'Code editor',
    icon: 'fa-code',
    category: 'desarrollo',
    installType: 'brew-cask',
    command: 'visual-studio-code'
  },
  {
    id: 'git',
    name: 'Git',
    description: 'Version control system',
    icon: 'fa-git',
    category: 'desarrollo',
    installType: 'brew',
    command: 'git'
  },
  {
    id: 'oh-my-zsh',
    name: 'Oh My Zsh',
    description: 'Zsh framework',
    icon: 'fa-terminal',
    category: 'configuracion',
    installType: 'curl-script',
    command: 'sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"'
  },
  {
    id: 'xcode-tools',
    name: 'Xcode Command Line Tools',
    description: 'Essential development tools',
    icon: 'fa-apple',
    category: 'configuracion',
    installType: 'xcode-select',
    command: 'xcode-select --install'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Messaging app',
    icon: 'fa-telegram',
    category: 'productividad',
    installType: 'mas',
    command: '747648890',
    postInstallNotes: 'Login with your phone number'
  }
];

describe('ScriptGenerator', () => {
  describe('getInstallCommand', () => {
    it('should generate correct brew install command', () => {
      const gitApp = mockApps.find(app => app.id === 'git')!;
      const command = (ScriptGenerator as any).getInstallCommand(gitApp);
      expect(command).toBe('brew install git');
    });

    it('should generate correct brew cask install command', () => {
      const vscodeApp = mockApps.find(app => app.id === 'visual-studio-code')!;
      const command = (ScriptGenerator as any).getInstallCommand(vscodeApp);
      expect(command).toBe('brew install --cask visual-studio-code');
    });

    it('should generate correct curl script command', () => {
      const homebrewApp = mockApps.find(app => app.id === 'homebrew')!;
      const command = (ScriptGenerator as any).getInstallCommand(homebrewApp);
      expect(command).toBe(homebrewApp.command);
    });

    it('should generate correct xcode-select command', () => {
      const xcodeApp = mockApps.find(app => app.id === 'xcode-tools')!;
      const command = (ScriptGenerator as any).getInstallCommand(xcodeApp);
      expect(command).toBe(xcodeApp.command);
    });

    it('should generate correct mas install command', () => {
      const telegramApp = mockApps.find(app => app.id === 'telegram')!;
      const command = (ScriptGenerator as any).getInstallCommand(telegramApp);
      expect(command).toBe('mas install 747648890');
    });
  });

  describe('generate', () => {
    it('should generate a complete script with header and footer', () => {
      const selectedApps = [mockApps[0], mockApps[1]]; // homebrew + vscode
      const script = ScriptGenerator.generate(selectedApps);
      
      expect(script).toContain('#!/bin/bash');
      expect(script).toContain('macOS Setup Script');
      expect(script).toContain('Generado por macOS Setup Assistant');
      expect(script).toContain('🎉 ¡Configuración completada!');
    });

    it('should include progress functions when enabled', () => {
      const options: ScriptGenerationOptions = {
        includeComments: true,
        includeProgressIndicators: true,
        includeErrorHandling: true
      };
      const script = ScriptGenerator.generate(mockApps, options);
      
      expect(script).toContain('show_progress()');
      expect(script).toContain('show_success()');
      expect(script).toContain('show_error()');
    });

    it('should install homebrew first when included', () => {
      const selectedApps = [mockApps[0], mockApps[1]]; // homebrew + vscode
      const script = ScriptGenerator.generate(selectedApps);
      
      const homebrewIndex = script.indexOf('Instalando Homebrew');
      const vscodeIndex = script.indexOf('Visual Studio Code');
      
      expect(homebrewIndex).toBeLessThan(vscodeIndex);
    });

    it('should install xcode tools when included', () => {
      const selectedApps = [mockApps[4]]; // xcode-tools
      const script = ScriptGenerator.generate(selectedApps);
      
      expect(script).toContain('Instalando Xcode Command Line Tools');
      expect(script).toContain('xcode-select --install');
    });

    it('should group brew packages together', () => {
      const brewApps = mockApps.filter(app => app.installType === 'brew');
      const script = ScriptGenerator.generate(brewApps);
      
      expect(script).toContain('Instalando paquetes de línea de comandos');
      brewApps.forEach(app => {
        expect(script).toContain(app.command);
      });
    });

    it('should handle cask applications individually', () => {
      const caskApps = mockApps.filter(app => app.installType === 'brew-cask');
      const script = ScriptGenerator.generate(caskApps);
      
      expect(script).toContain('Instalando aplicaciones');
      caskApps.forEach(app => {
        expect(script).toContain(`Instalando ${app.name}`);
        expect(script).toContain(`brew install --cask ${app.command}`);
      });
    });

    it('should include oh-my-zsh installation when selected', () => {
      const ohMyZshApp = mockApps.find(app => app.id === 'oh-my-zsh')!;
      const script = ScriptGenerator.generate([ohMyZshApp]);
      
      expect(script).toContain('Instalando Oh My Zsh');
      expect(script).toContain('ohmyzsh/ohmyzsh/master/tools/install.sh');
    });

    it('should include post-install notes in footer', () => {
      const appsWithNotes = mockApps.filter(app => app.postInstallNotes);
      const script = ScriptGenerator.generate(appsWithNotes);
      
      appsWithNotes.forEach(app => {
        expect(script).toContain(`💡 ${app.name}: ${app.postInstallNotes}`);
      });
    });

    it('should list all installed applications in footer', () => {
      const selectedApps = mockApps.slice(0, 3);
      const script = ScriptGenerator.generate(selectedApps);
      
      expect(script).toContain('Aplicaciones instaladas:');
      selectedApps.forEach(app => {
        expect(script).toContain(`- ${app.name}`);
      });
    });

    it('should include custom header when provided', () => {
      const options: ScriptGenerationOptions = {
        includeComments: true,
        includeProgressIndicators: true,
        includeErrorHandling: true,
        customHeader: 'Custom setup for John Doe'
      };
      const script = ScriptGenerator.generate(mockApps.slice(0, 1), options);
      
      expect(script).toContain('# Custom setup for John Doe');
    });

    it('should handle empty app list gracefully', () => {
      const script = ScriptGenerator.generate([]);
      
      expect(script).toContain('#!/bin/bash');
      expect(script).toContain('🎉 ¡Configuración completada!');
      expect(script).not.toContain('Instalando');
    });

    it('should include current date in header', () => {
      const script = ScriptGenerator.generate(mockApps.slice(0, 1));
      const today = new Date().toLocaleDateString('es-ES');
      
      expect(script).toContain(`# Fecha: ${today}`);
    });
  });

  describe('downloadScript', () => {
    let createElementSpy: jest.SpyInstance;
    let appendChildSpy: jest.SpyInstance;
    let removeChildSpy: jest.SpyInstance;
    let clickSpy: jest.SpyInstance;
    let createObjectURLSpy: jest.SpyInstance;
    let revokeObjectURLSpy: jest.SpyInstance;

    beforeEach(() => {
      // Mock DOM methods
      const mockElement = {
        style: {},
        href: '',
        download: '',
        click: jest.fn()
      };
      
      createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockElement as any);
      appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation();
      removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation();
      clickSpy = mockElement.click;
      
      // Mock URL methods
      createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url');
      revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL').mockImplementation();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should create and download script file', () => {
      const content = 'test script content';
      const filename = 'test-script.sh';
      
      ScriptGenerator.downloadScript(content, filename);
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalled();
    });

    it('should use default filename when not provided', () => {
      const content = 'test script content';
      
      ScriptGenerator.downloadScript(content);
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
    });
  });

  describe('copyToClipboard', () => {
    let writeTextSpy: jest.SpyInstance;

    beforeEach(() => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn()
        }
      });
      writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should copy content to clipboard', async () => {
      const content = 'test content';
      writeTextSpy.mockResolvedValue(undefined);
      
      await ScriptGenerator.copyToClipboard(content);
      
      expect(writeTextSpy).toHaveBeenCalledWith(content);
    });

    it('should fallback to execCommand when clipboard API fails', async () => {
      const content = 'test content';
      writeTextSpy.mockRejectedValue(new Error('Clipboard API not available'));
      
      // Mock fallback methods
      const mockTextArea = {
        value: '',
        select: jest.fn()
      };
      const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockTextArea as any);
      const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation();
      const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation();
      const execCommandSpy = jest.spyOn(document, 'execCommand').mockReturnValue(true);
      
      await ScriptGenerator.copyToClipboard(content);
      
      expect(createElementSpy).toHaveBeenCalledWith('textarea');
      expect(mockTextArea.value).toBe(content);
      expect(mockTextArea.select).toHaveBeenCalled();
      expect(execCommandSpy).toHaveBeenCalledWith('copy');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      
      jest.restoreAllMocks();
    });
  });
});
