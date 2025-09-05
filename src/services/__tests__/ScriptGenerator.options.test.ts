import { ScriptGenerator } from '../ScriptGenerator';
import type { SearchableApp } from '../../types/api';

const createMockApp = (overrides: Partial<SearchableApp> = {}): SearchableApp => ({
  id: 'test-app',
  name: 'Test App',
  description: 'Test application',
  homepage: 'https://test.com',
  version: '1.0.0',
  installType: 'brew-cask',
  command: 'brew install --cask test-app',
  category: 'Development',
  source: 'homebrew',
  ...overrides
});

describe('ScriptGenerator Options Implementation', () => {
  const mockApps: SearchableApp[] = [
    createMockApp({ 
      id: 'vscode', 
      name: 'VS Code', 
      installType: 'brew-cask',
      command: 'brew install --cask visual-studio-code'
    }),
    createMockApp({ 
      id: 'git', 
      name: 'Git', 
      installType: 'brew',
      command: 'brew install git'
    })
  ];

  describe('includeUpdates option', () => {
    it('should include brew upgrade when includeUpdates is true', () => {
      const script = ScriptGenerator.generateInstallScript(mockApps, {
        includeUpdates: true,
        includeCleanup: false,
        verboseOutput: false,
        skipConfirmations: false
      });

      expect(script).toContain('brew upgrade');
      expect(script).toContain('Homebrew actualizado');
    });

    it('should not include brew upgrade when includeUpdates is false', () => {
      const script = ScriptGenerator.generateInstallScript(mockApps, {
        includeUpdates: false,
        includeCleanup: false,
        verboseOutput: false,
        skipConfirmations: false
      });

      expect(script).not.toContain('brew upgrade');
      expect(script).not.toContain('Homebrew actualizado');
    });
  });

  describe('verboseOutput option', () => {
    it('should include --verbose flag when verboseOutput is true', () => {
      const script = ScriptGenerator.generateInstallScript(mockApps, {
        includeUpdates: false,
        includeCleanup: false,
        verboseOutput: true,
        skipConfirmations: false
      });

      expect(script).toContain('brew install --cask visual-studio-code --verbose');
      expect(script).toContain('brew install git --verbose');
    });

    it('should not include --verbose flag when verboseOutput is false', () => {
      const script = ScriptGenerator.generateInstallScript(mockApps, {
        includeUpdates: false,
        includeCleanup: false,
        verboseOutput: false,
        skipConfirmations: false
      });

      expect(script).not.toContain('--verbose');
    });

    it('should include --verbose in brew upgrade when both options are true', () => {
      const script = ScriptGenerator.generateInstallScript(mockApps, {
        includeUpdates: true,
        includeCleanup: false,
        verboseOutput: true,
        skipConfirmations: false
      });

      expect(script).toContain('brew upgrade --verbose');
    });
  });

  describe('includeCleanup option', () => {
    it('should include cleanup section when includeCleanup is true', () => {
      const script = ScriptGenerator.generateInstallScript(mockApps, {
        includeUpdates: false,
        includeCleanup: true,
        verboseOutput: false,
        skipConfirmations: false
      });

      expect(script).toContain('Limpiando archivos temporales');
      expect(script).toContain('brew cleanup');
      expect(script).toContain('Limpieza completada');
    });

    it('should not include cleanup section when includeCleanup is false', () => {
      const script = ScriptGenerator.generateInstallScript(mockApps, {
        includeUpdates: false,
        includeCleanup: false,
        verboseOutput: false,
        skipConfirmations: false
      });

      expect(script).not.toContain('Limpiando archivos temporales');
      expect(script).not.toContain('brew cleanup');
      expect(script).not.toContain('Limpieza completada');
    });
  });

  describe('skipConfirmations option', () => {
    it('should include confirmation prompts when skipConfirmations is false', () => {
      const script = ScriptGenerator.generateInstallScript(mockApps, {
        includeUpdates: false,
        includeCleanup: false,
        verboseOutput: false,
        skipConfirmations: false
      });

      expect(script).toContain('read -p "¿Continuar con la instalación? (y/n): "');
    });

    it('should not include confirmation prompts when skipConfirmations is true', () => {
      const script = ScriptGenerator.generateInstallScript(mockApps, {
        includeUpdates: false,
        includeCleanup: false,
        verboseOutput: false,
        skipConfirmations: true
      });

      expect(script).not.toContain('read -p "¿Continuar con la instalación? (y/n): "');
    });
  });

  describe('combined options', () => {
    it('should work correctly with all options enabled', () => {
      const script = ScriptGenerator.generateInstallScript(mockApps, {
        includeUpdates: true,
        includeCleanup: true,
        verboseOutput: true,
        skipConfirmations: true
      });

      // Should include updates with verbose
      expect(script).toContain('brew upgrade --verbose');
      
      // Should include verbose flags in installations
      expect(script).toContain('--verbose');
      
      // Should include cleanup
      expect(script).toContain('brew cleanup');
      
      // Should not include confirmations
      expect(script).not.toContain('read -p "¿Continuar con la instalación? (y/n): "');
    });

    it('should work correctly with all options disabled', () => {
      const script = ScriptGenerator.generateInstallScript(mockApps, {
        includeUpdates: false,
        includeCleanup: false,
        verboseOutput: false,
        skipConfirmations: false
      });

      // Should not include upgrade
      expect(script).not.toContain('brew upgrade');
      
      // Should not include verbose flags
      expect(script).not.toContain('--verbose');
      
      // Should not include cleanup
      expect(script).not.toContain('brew cleanup');
      
      // Should include confirmations
      expect(script).toContain('read -p "¿Continuar con la instalación? (y/n): "');
    });
  });
});
