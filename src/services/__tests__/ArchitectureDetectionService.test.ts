import { ArchitectureDetectionService } from '../ArchitectureDetectionService';

describe('ArchitectureDetectionService', () => {
  describe('getArchitectureSupport', () => {
    it('should return known architecture support for popular apps', () => {
      // Test known apps
      const chromeSupport = ArchitectureDetectionService.getArchitectureSupport(
        'google-chrome', 
        'Google Chrome', 
        'brew-cask'
      );
      expect(chromeSupport).toEqual({ arm64: true, intel: true });

      const vscodeSupport = ArchitectureDetectionService.getArchitectureSupport(
        'visual-studio-code', 
        'Visual Studio Code', 
        'brew-cask'
      );
      expect(vscodeSupport).toEqual({ arm64: true, intel: true });

      const sourcetreeSupport = ArchitectureDetectionService.getArchitectureSupport(
        'sourcetree', 
        'Sourcetree', 
        'brew-cask'
      );
      expect(sourcetreeSupport).toEqual({ arm64: false, intel: true });
    });

    it('should detect architecture for CLI tools', () => {
      const gitSupport = ArchitectureDetectionService.getArchitectureSupport(
        'git', 
        'Git', 
        'brew'
      );
      expect(gitSupport).toEqual({ arm64: true, intel: true });

      const nodeSupport = ArchitectureDetectionService.getArchitectureSupport(
        'node', 
        'Node.js', 
        'brew'
      );
      expect(nodeSupport).toEqual({ arm64: true, intel: true });
    });

    it('should use heuristics for unknown modern apps', () => {
      const modernAppSupport = ArchitectureDetectionService.getArchitectureSupport(
        'some-modern-app', 
        'Some Modern Code Editor', 
        'brew-cask'
      );
      expect(modernAppSupport).toEqual({ arm64: true, intel: true });
    });

    it('should detect modern development tools', () => {
      const dockerSupport = ArchitectureDetectionService.getArchitectureSupport(
        'unknown-docker-tool', 
        'Docker Something', 
        'brew'
      );
      expect(dockerSupport).toEqual({ arm64: true, intel: true });
    });

    it('should handle legacy tools', () => {
      const legacySupport = ArchitectureDetectionService.getArchitectureSupport(
        'some-x11-tool', 
        'X11 Legacy Tool', 
        'brew'
      );
      expect(legacySupport).toEqual({ arm64: false, intel: true });
    });

    it('should handle specialized apps', () => {
      const virtualboxSupport = ArchitectureDetectionService.getArchitectureSupport(
        'virtualbox', 
        'VirtualBox', 
        'brew-cask'
      );
      expect(virtualboxSupport).toEqual({ arm64: false, intel: true });
    });

    it('should default to universal support for unknown CLI tools', () => {
      const unknownTool = ArchitectureDetectionService.getArchitectureSupport(
        'unknown-cli-tool', 
        'Unknown CLI Tool', 
        'brew'
      );
      expect(unknownTool).toEqual({ arm64: true, intel: true });
    });

    it('should default to universal support for unknown GUI apps', () => {
      const unknownApp = ArchitectureDetectionService.getArchitectureSupport(
        'unknown-gui-app', 
        'Unknown GUI App', 
        'brew-cask'
      );
      expect(unknownApp).toEqual({ arm64: true, intel: true });
    });
  });
});
