import { ScriptGenerator } from '../ScriptGenerator';
import type { SearchableApp } from '../../types/api';

describe('ScriptGenerator - Updated', () => {
  const mockApp: SearchableApp = {
    id: 'test-app',
    name: 'Test App',
    description: 'Test description',
    homepage: 'https://test.com',
    version: '1.0.0',
    installType: 'brew-cask',
    command: 'brew install --cask test-app',
    category: 'Development',
    source: 'homebrew'
  };

  const brewApp: SearchableApp = {
    id: 'git',
    name: 'Git',
    description: 'Version control system',
    homepage: 'https://git-scm.com',
    version: 'latest',
    installType: 'brew',
    command: 'brew install git',
    category: 'Development',
    source: 'homebrew'
  };

  describe('generate', () => {
    it('should generate a script for single app', () => {
      const script = ScriptGenerator.generate([mockApp]);
      
      expect(script).toContain('#!/bin/bash');
      expect(script).toContain('macOS Setup Script');
      expect(script).toContain('Test App');
      expect(script).toContain('brew install --cask test-app');
    });

    it('should handle empty app list', () => {
      const script = ScriptGenerator.generate([]);
      
      expect(script).toBe('# No hay aplicaciones seleccionadas para instalar');
    });

    it('should generate script with options', () => {
      const options = {
        customHeader: 'Custom setup for development',
        includeCleanup: false,
        verboseOutput: true
      };
      
      const script = ScriptGenerator.generate([mockApp], options);
      
      expect(script).toContain('Custom setup for development');
      expect(script).toContain('Test App');
    });

    it('should handle both brew and cask apps', () => {
      const script = ScriptGenerator.generate([brewApp, mockApp]);
      
      expect(script).toContain('brew install git');
      expect(script).toContain('brew install --cask test-app');
      expect(script).toContain('Git');
      expect(script).toContain('Test App');
    });
  });

  describe('generateCommandList', () => {
    it('should generate simple command list', () => {
      const commands = ScriptGenerator.generateCommandList([mockApp, brewApp]);
      
      expect(commands).toContain('brew install git');
      expect(commands).toContain('brew install --cask test-app');
    });

    it('should handle empty list', () => {
      const commands = ScriptGenerator.generateCommandList([]);
      
      expect(commands).toContain('# No hay aplicaciones seleccionadas');
    });
  });

  describe('generateBrewfile', () => {
    it('should generate Brewfile format', () => {
      const brewfile = ScriptGenerator.generateBrewfile([mockApp, brewApp]);
      
      expect(brewfile).toContain('# Brewfile generado por macOS Setup Assistant');
      expect(brewfile).toContain('brew "git"');
      expect(brewfile).toContain('cask "test-app"');
      expect(brewfile).toContain('brew bundle --file=Brewfile');
    });
  });

  describe('utility methods', () => {
    // Mock DOM methods for testing
    beforeEach(() => {
      // Mock document methods
      global.document = {
        createElement: jest.fn(() => ({
          href: '',
          download: '',
          click: jest.fn(),
          appendChild: jest.fn(),
          removeChild: jest.fn()
        })),
        body: {
          appendChild: jest.fn(),
          removeChild: jest.fn()
        }
      } as any;

      global.URL = {
        createObjectURL: jest.fn(() => 'mock-url'),
        revokeObjectURL: jest.fn()
      } as any;
    });

    it('should handle downloadScript', () => {
      expect(() => {
        ScriptGenerator.downloadScript('test content', 'test.sh');
      }).not.toThrow();
    });

    it('should handle copyToClipboard', async () => {
      // Mock navigator.clipboard
      global.navigator = {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined)
        }
      } as any;

      global.window = {
        isSecureContext: true
      } as any;

      await expect(ScriptGenerator.copyToClipboard('test content')).resolves.not.toThrow();
    });
  });
});
