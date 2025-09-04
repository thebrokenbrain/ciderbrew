import { ScriptGenerator } from '../ScriptGenerator';
import type { App } from '../../types';

// Simple mock data for testing
const mockApp: App = {
  id: 'test-app',
  name: 'Test App',
  description: 'Test application',
  icon: 'fa-test',
  category: 'desarrollo',
  installType: 'brew',
  command: 'test-app'
};

describe('ScriptGenerator Basic Tests', () => {
  describe('generate', () => {
    it('should generate a script with header', () => {
      const script = ScriptGenerator.generate([mockApp]);
      
      expect(script).toContain('#!/bin/bash');
      expect(script).toContain('macOS Setup Script');
    });

    it('should handle empty app list', () => {
      const script = ScriptGenerator.generate([]);
      
      expect(script).toContain('#!/bin/bash');
      expect(script).toContain('🎉 ¡Configuración completada!');
    });

    it('should include app information', () => {
      const script = ScriptGenerator.generate([mockApp]);
      
      expect(script).toContain('Test App');
    });
  });
});
